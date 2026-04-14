import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth-server'
import { createUser, deleteUser } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function UsersPage() {
  const session = await getSession()
  if (session?.role !== 'admin') redirect('/')

  const users = await prisma.user.findMany({ orderBy: { createdAt: 'asc' } })

  return (
    <div>
      <div className="mb-8">
        <Link href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '0.82rem', color: '#64748b', textDecoration: 'none',
          marginBottom: '0.75rem', fontWeight: 500,
        }} className="back-link">
          ← ダッシュボードへ戻る
        </Link>
        <p className="section-title">システム管理</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          ユーザー管理
        </h1>
      </div>

      {/* Add user form */}
      <div className="card mb-6" style={{ padding: '1.5rem' }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
          ユーザーを追加
        </h2>
        <form action={createUser}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                氏名 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="name" placeholder="例：山田 太郎" required className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                メールアドレス <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="email" type="email" placeholder="example@company.com" required className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                パスワード <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="password" type="password" placeholder="8文字以上" required minLength={8} className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                権限 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <select name="role" required className="form-input">
                <option value="user">一般ユーザー</option>
                <option value="admin">管理者</option>
              </select>
            </div>
          </div>
          <button type="submit" className="btn-primary">＋ 追加する</button>
        </form>
      </div>

      {/* User list */}
      <div className="card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>ユーザー一覧</h2>
          <span style={{
            background: '#eff6ff', color: '#2563eb', fontSize: '0.75rem',
            fontWeight: 600, padding: '2px 10px', borderRadius: '999px',
          }}>
            {users.length}名
          </span>
        </div>

        {users.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>ユーザーが登録されていません</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>氏名</th>
                <th>メールアドレス</th>
                <th>権限</th>
                <th>登録日</th>
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: u.role === 'admin'
                          ? 'linear-gradient(135deg, #7c3aed, #2563eb)'
                          : 'linear-gradient(135deg, #2563eb, #0891b2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0,
                      }}>
                        {u.name.charAt(0)}
                      </div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{ color: '#64748b' }}>{u.email}</td>
                  <td>
                    <span style={{
                      background: u.role === 'admin' ? '#f5f3ff' : '#eff6ff',
                      color: u.role === 'admin' ? '#7c3aed' : '#2563eb',
                      padding: '3px 10px', borderRadius: '999px',
                      fontSize: '0.78rem', fontWeight: 600,
                    }}>
                      {u.role === 'admin' ? '管理者' : '一般'}
                    </span>
                  </td>
                  <td style={{ color: '#64748b', fontSize: '0.82rem' }}>
                    {new Date(u.createdAt).toLocaleDateString('ja-JP')}
                  </td>
                  <td>
                    {users.length > 1 && (
                      <form action={deleteUser.bind(null, u.id)}>
                        <button type="submit" className="btn-danger">削除</button>
                      </form>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
