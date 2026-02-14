import { NextRequest, NextResponse } from 'next/server'
import { getDbClient } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const db = getDbClient()
    const query = 'SELECT * FROM interviews WHERE id = $1'
    const result = await db.query(query, [params.id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error fetching interview:', error)
    return NextResponse.json(
      { error: 'Failed to fetch interview' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const db = getDbClient()
    const body = await request.json()
    const { interviewee_name, interview_date, content, summary } = body

    const query = `
      UPDATE interviews
      SET
        interviewee_name = $1,
        interview_date = $2,
        content = $3,
        summary = $4,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $5
      RETURNING *
    `
    const values = [
      interviewee_name,
      interview_date,
      content,
      summary || content.substring(0, 100),
      params.id,
    ]

    const result = await db.query(query, values)

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(result.rows[0])
  } catch (error) {
    console.error('Error updating interview:', error)
    return NextResponse.json(
      { error: 'Failed to update interview' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!process.env.DATABASE_URL) {
      return NextResponse.json(
        { error: 'Database not configured' },
        { status: 503 }
      )
    }

    const db = getDbClient()
    const query = 'DELETE FROM interviews WHERE id = $1 RETURNING id'
    const result = await db.query(query, [params.id])

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Interview not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting interview:', error)
    return NextResponse.json(
      { error: 'Failed to delete interview' },
      { status: 500 }
    )
  }
}
