import { prisma } from '@/lib/prisma'
import { createEquipment, deleteEquipment } from '@/app/actions'
import Link from 'next/link'

export default async function EquipmentPage() {
  const equipments = await prisma.equipment.findMany({ orderBy: { createdAt: 'desc' } })

  const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    available: { label: '利用可能', color: '#16a34a', bg: '#f0fdf4' },
    in_use:    { label: '使用中',   color: '#d97706', bg: '#fffbeb' },
    broken:    { label: '故障中',   color: '#dc2626', bg: '#fef2f2' },
  }

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
        <p className="section-title">資産</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          備品管理
        </h1>
      </div>

      {/* Status summary */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '1.5rem' }}>
        {Object.entries(statusConfig).map(([key, cfg]) => {
          const count = equipments.filter(e => e.status === key).length
          return (
            <div key={key} style={{
              flex: 1,
              background: cfg.bg,
              border: `1px solid ${cfg.color}22`,
              borderRadius: '10px',
              padding: '0.875rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '0.82rem', color: cfg.color, fontWeight: 600 }}>{cfg.label}</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: cfg.color }}>{count}</span>
            </div>
          )
        })}
      </div>

      {/* Add form */}
      <div className="card mb-6" style={{ padding: '1.5rem' }}>
        <h2 style={{ margin: '0 0 1.25rem', fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
          備品を追加
        </h2>
        <form action={createEquipment}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                備品名 <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="name" placeholder="例：ノートPC" required className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                カテゴリ <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input name="category" placeholder="例：PC、文具、家具" required className="form-input" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                状態
              </label>
              <select name="status" className="form-input">
                <option value="available">利用可能</option>
                <option value="in_use">使用中</option>
                <option value="broken">故障中</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: '#475569', marginBottom: '6px' }}>
                使用者
                <span style={{ color: '#94a3b8', fontWeight: 400, marginLeft: '4px' }}>（任意）</span>
              </label>
              <input name="assignedTo" placeholder="例：田中 太郎" className="form-input" />
            </div>
          </div>
          <button type="submit" className="btn-primary">
            ＋ 追加する
          </button>
        </form>
      </div>

      {/* Equipment list */}
      <div className="card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
            備品一覧
          </h2>
          <span style={{
            background: '#f0f9ff',
            color: '#0891b2',
            fontSize: '0.75rem',
            fontWeight: 600,
            padding: '2px 10px',
            borderRadius: '999px',
          }}>
            {equipments.length}件
          </span>
        </div>

        {equipments.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📦</div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>備品が登録されていません</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>備品名</th>
                <th>カテゴリ</th>
                <th>状態</th>
                <th>使用者</th>
                <th style={{ width: '60px' }}></th>
              </tr>
            </thead>
            <tbody>
              {equipments.map((eq) => {
                const cfg = statusConfig[eq.status] ?? { label: eq.status, color: '#64748b', bg: '#f8fafc' }
                return (
                  <tr key={eq.id}>
                    <td style={{ fontWeight: 600, color: '#0f172a' }}>{eq.name}</td>
                    <td>
                      <span style={{
                        background: '#f1f5f9',
                        color: '#475569',
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 500,
                      }}>{eq.category}</span>
                    </td>
                    <td>
                      <span style={{
                        background: cfg.bg,
                        color: cfg.color,
                        padding: '3px 10px',
                        borderRadius: '999px',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        border: `1px solid ${cfg.color}33`,
                      }}>{cfg.label}</span>
                    </td>
                    <td style={{ color: '#64748b' }}>
                      {eq.assignedTo ?? <span style={{ color: '#cbd5e1' }}>—</span>}
                    </td>
                    <td>
                      <form action={deleteEquipment.bind(null, eq.id)}>
                        <button type="submit" className="btn-danger">削除</button>
                      </form>
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
