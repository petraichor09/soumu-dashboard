import { prisma } from '@/lib/prisma'
import { createLeaveRequest, updateLeaveStatus, deleteLeaveRequest } from '@/app/actions'
import Link from 'next/link'

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  pending:  { label: '申請中', color: '#d97706', bg: '#fffbeb' },
  approved: { label: '承認済', color: '#16a34a', bg: '#f0fdf4' },
  rejected: { label: '却下',   color: '#dc2626', bg: '#fef2f2' },
}

export default async function LeavePage() {
  const requests = await prisma.leaveRequest.findMany({ orderBy: { createdAt: 'desc' } })
  const pendingCount = requests.filter(r => r.status === 'pending').length

  return (
    <div>
      <div className="mb-8">
        <Link href="/" className="back-link" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          fontSize: '0.82rem', color: '#64748b', textDecoration: 'none',
          marginBottom: '0.75rem', fontWeight: 500,
        }}>
          ← ダッシュボードへ戻る
        </Link>
        <p className="section-title">申請管理</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          有休申請
        </h1>
      </div>

      {/* Summary */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} style={{
            flex: 1, background: cfg.bg, border: `1px solid ${cfg.color}22`,
            borderRadius: '10px', padding: '0.875rem 1.25rem',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{ fontSize: '0.82rem', color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: cfg.color }}>
              {requests.filter(r => r.status === key).length}
            </span>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="card mb-6" style={{ padding: '1.5rem' }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
          有休申請を提出
        </h2>
        <form action={createLeaveRequest}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                氏名 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="employeeName" placeholder="例：田中 太郎" required className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                部署 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="department" placeholder="例：営業部" required className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                開始日 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="startDate" type="date" required className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                終了日 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="endDate" type="date" required className="form-input" />
            </div>
            <div style={{ gridColumn: 'span 2' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                理由 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="reason" placeholder="例：私用のため" required className="form-input" />
            </div>
          </div>
          <button type="submit" className="btn-primary">＋ 申請する</button>
        </form>
      </div>

      {/* List */}
      <div className="card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>申請一覧</h2>
          {pendingCount > 0 && (
            <span style={{ background: '#fffbeb', color: '#d97706', fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px', borderRadius: '999px' }}>
              未処理 {pendingCount}件
            </span>
          )}
        </div>
        {requests.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>申請がありません</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>氏名</th>
                <th>部署</th>
                <th>開始日</th>
                <th>終了日</th>
                <th>理由</th>
                <th>状態</th>
                <th style={{ width: '160px' }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => {
                const cfg = statusConfig[r.status] ?? statusConfig.pending
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 600 }}>{r.employeeName}</td>
                    <td>
                      <span style={{ background: '#eff6ff', color: '#2563eb', padding: '3px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 500 }}>
                        {r.department}
                      </span>
                    </td>
                    <td style={{ color: '#64748b' }}>{r.startDate}</td>
                    <td style={{ color: '#64748b' }}>{r.endDate}</td>
                    <td style={{ color: '#64748b' }}>{r.reason}</td>
                    <td>
                      <span style={{ background: cfg.bg, color: cfg.color, padding: '3px 10px', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, border: `1px solid ${cfg.color}33` }}>
                        {cfg.label}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        {r.status === 'pending' && (
                          <>
                            <form action={updateLeaveStatus.bind(null, r.id, 'approved')}>
                              <button type="submit" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '6px', padding: '3px 10px', cursor: 'pointer' }}>
                                承認
                              </button>
                            </form>
                            <form action={updateLeaveStatus.bind(null, r.id, 'rejected')}>
                              <button type="submit" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '3px 10px', cursor: 'pointer' }}>
                                却下
                              </button>
                            </form>
                          </>
                        )}
                        <form action={deleteLeaveRequest.bind(null, r.id)}>
                          <button type="submit" className="btn-danger">削除</button>
                        </form>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
