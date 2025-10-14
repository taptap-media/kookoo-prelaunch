// Use runtime require for 'pg' so the server code can be parsed even if dependencies
// are not yet installed locally. If DATABASE_URL is not provided, transactional
// helpers will throw with a clear message.
import dotenv from 'dotenv'

dotenv.config()

const connectionString = process.env.DATABASE_URL || ''

let pool: any = null
if (connectionString) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { Pool } = require('pg')
  pool = new Pool({ connectionString })
}

/**
 * Execute a callback inside a Postgres transaction. Requires DATABASE_URL to be set
 * and the 'pg' package to be installed. Throws a helpful error if misconfigured.
 */
export async function withTransaction<T>(callback: (client: any) => Promise<T>): Promise<T> {
  if (!pool) {
    throw new Error('withTransaction requires DATABASE_URL to be set and pg installed.')
  }

  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await callback(client)
    await client.query('COMMIT')
    return result
  } catch (err) {
    await client.query('ROLLBACK')
    throw err
  } finally {
    client.release()
  }
}

export { pool }
