import { Pool } from 'pg'

let pool: Pool | null = null

export function getDbClient() {
  const dbUrl = process.env.DATABASE_URL

  if (!dbUrl) {
    throw new Error('Missing DATABASE_URL environment variable')
  }

  if (!pool) {
    pool = new Pool({
      connectionString: dbUrl,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
    })
  }

  return pool
}

export async function closeDbConnection() {
  if (pool) {
    await pool.end()
    pool = null
  }
}
