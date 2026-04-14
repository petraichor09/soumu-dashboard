import { createClient } from '@libsql/client'
import bcrypt from 'bcryptjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dbPath = path.resolve(__dirname, '../dev.db')
const db = createClient({ url: `file:${dbPath}` })

async function main() {
  const result = await db.execute({
    sql: 'SELECT id FROM User WHERE email = ?',
    args: ['admin@example.com'],
  })
  if (result.rows.length > 0) {
    console.log('管理者ユーザーはすでに存在します')
    return
  }
  const password = await bcrypt.hash('admin1234', 12)
  await db.execute({
    sql: 'INSERT INTO User (name, email, password, role, createdAt) VALUES (?, ?, ?, ?, ?)',
    args: ['管理者', 'admin@example.com', password, 'admin', new Date().toISOString()],
  })
  console.log('初期管理者ユーザーを作成しました')
  console.log('  Email: admin@example.com')
  console.log('  Password: admin1234')
}

main().catch(console.error).finally(() => db.close())
