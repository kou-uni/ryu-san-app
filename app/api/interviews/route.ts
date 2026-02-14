import { NextRequest, NextResponse } from 'next/server'
import { getDbClient } from '@/lib/db'
import type { Interview } from '@/lib/types'

export async function GET(request: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Please set DATABASE_URL environment variable.' },
        { status: 503 }
      )
    }

    const db = getDbClient()
    const searchParams = request.nextUrl.searchParams
    const keyword = searchParams.get('keyword')

    let query = 'SELECT * FROM interviews ORDER BY interview_date DESC'
    let values: string[] = []

    // If keyword is provided, search in interviewee_name, content, and summary
    if (keyword) {
      query = `
        SELECT * FROM interviews
        WHERE
          LOWER(interviewee_name) LIKE $1 OR
          LOWER(content) LIKE $1 OR
          LOWER(summary) LIKE $1
        ORDER BY interview_date DESC
      `
      values = [`%${keyword.toLowerCase()}%`]
    }

    const result = await db.query(query, values)
    return NextResponse.json(result.rows)
  } catch (error) {
    console.error('Error fetching interviews:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interviews' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check for required environment variables
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured. Please set DATABASE_URL environment variable.' },
        { status: 503 }
      )
    }

    const db = getDbClient()
    const body = await request.json()
    const { interviewee_name, interview_date, content, summary } = body

    if (!interviewee_name || !interview_date || !content) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const query = `
      INSERT INTO interviews (interviewee_name, interview_date, content, summary)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `
    const values = [
      interviewee_name,
      interview_date,
      content,
      summary || content.substring(0, 100),
    ]

    const result = await db.query(query, values)
    return NextResponse.json(result.rows[0], { status: 201 })
  } catch (error) {
    console.error('Error creating interview:', error)
    return NextResponse.json(
      { error: 'Failed to create interview' },
      { status: 500 }
    )
  }
}
