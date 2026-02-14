// Test database connection
const { Pool } = require('pg')
require('dotenv').config({ path: '.env.local' })

async function testConnection() {
  console.log('Testing database connection...')
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Set' : 'NOT SET')

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set!')
    process.exit(1)
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  })

  try {
    // Test connection
    const client = await pool.connect()
    console.log('✅ Connected to database successfully')

    // Check if interviews table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_name = 'interviews'
      );
    `)

    if (tableCheck.rows[0].exists) {
      console.log('✅ Table "interviews" exists')

      // Count records
      const countResult = await client.query('SELECT COUNT(*) FROM interviews')
      console.log(`📊 Number of records: ${countResult.rows[0].count}`)

      // Show table structure
      const structureResult = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'interviews'
        ORDER BY ordinal_position;
      `)
      console.log('\n📋 Table structure:')
      structureResult.rows.forEach(col => {
        console.log(`  - ${col.column_name}: ${col.data_type} (nullable: ${col.is_nullable})`)
      })
    } else {
      console.log('❌ Table "interviews" does NOT exist')
      console.log('Run the init-db.sql script to create the table')
    }

    client.release()
    await pool.end()
    console.log('\n✅ Test completed successfully')
  } catch (err) {
    console.error('❌ Database connection error:', err.message)
    console.error('Full error:', err)
    await pool.end()
    process.exit(1)
  }
}

testConnection()
