import { prisma } from '@/lib/prisma'
import { createEmployee, deleteEmployee } from '@/app/actions'
import Link from 'next/link'

export default async function EmployeesPage() {
  const employees = await prisma.employee.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <Link href="/" style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          fontSize: '0.82rem',
          color: '#64748b',
          textDecoration: 'none',
          marginBottom: '0.75rem',
          fontWeight: 500,
        }} className="back-link">
          ← ダッシュボードへ戻る
        </Link>
        <p className="section-title">人事</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          従業員管理
        </h1>
      </div>

      {/* Add form */}
      <div className="card mb-6" style={{ padding: '1.5rem' }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
          従業員を追加
        </h2>
        <form action={createEmployee}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                氏名 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="name" placeholder="例：田中 太郎" required className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                部署 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="department" placeholder="例：営業部" required className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                メールアドレス <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="email" type="email" placeholder="例：tanaka@example.com" required className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                電話番号
                <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>（任意）</span>
              </label>
              <input name="phone" placeholder="例：090-0000-0000" className="form-input" />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            ＋ 追加する
          </button>
        </form>
      </div>

      {/* Employee list */}
      <div className="card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
            従業員一覧
          </h2>
          <span style={{
            background: '#eff6ff',
            color: '#2563eb',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '2px 10px',
            borderRadius: '999px',
          }}>
            {employees.length}名
          </span>
        </div>

        {employees.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>👥</div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>従業員が登録されていません</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>氏名</th>
                <th>部署</th>
                <th>メールアドレス</th>
                <th>電話番号</th>
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {employees.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 600, color: '#0f172a' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        flexShrink: 0,
                      }}>
                        {e.name.charAt(0)}
                      </div>
                      {e.name}
                    </div>
                  </td>
                  <td>
                    <span style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      padding: '3px 10px',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                    }}>{e.department}</span>
                  </td>
                  <td style={{ color: '#64748b' }}>{e.email}</td>
                  <td style={{ color: '#64748b' }}>{e.phone ?? <span style={{ color: '#cbd5e1' }}>—</span>}</td>
                  <td>
                    <form action={deleteEmployee.bind(null, e.id)}>
                      <button type="submit" className="btn-danger">削除</button>
                    </form>
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
