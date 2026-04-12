import { prisma } from '@/lib/prisma'
import Link from 'next/link'

export default async function DashboardPage() {
  const [employeeCount, equipmentCount, availableCount, overtimePending, leavePending] = await Promise.all([
    prisma.employee.count(),
    prisma.equipment.count(),
    prisma.equipment.count({ where: { status: 'available' } }),
    prisma.overtimeRequest.count({ where: { status: 'pending' } }),
    prisma.leaveRequest.count({ where: { status: 'pending' } }),
  ])

  const recentEmployees = await prisma.employee.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5,
  })

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <p className="section-title">概要</p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
          ダッシュボード
        </h1>
      </div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatCard
          title="従業員数"
          value={employeeCount}
          unit="名"
          href="/employees"
          color="#2563eb"
          bg="#eff6ff"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          }
        />
        <StatCard
          title="備品数"
          value={equipmentCount}
          unit="件"
          href="/equipment"
          color="#0891b2"
          bg="#ecfeff"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
              <rect x="2" y="7" width="20" height="14" rx="2" />
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              <line x1="12" y1="12" x2="12" y2="16" />
              <line x1="10" y1="14" x2="14" y2="14" />
            </svg>
          }
        />
        <StatCard
          title="利用可能備品"
          value={availableCount}
          unit="件"
          href="/equipment"
          color="#16a34a"
          bg="#f0fdf4"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
              <polyline points="20 6 9 17 4 12" />
            </svg>
          }
        />
        <StatCard
          title="残業申請（未処理）"
          value={overtimePending}
          unit="件"
          href="/overtime"
          color="#d97706"
          bg="#fffbeb"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          }
        />
        <StatCard
          title="有休申請（未処理）"
          value={leavePending}
          unit="件"
          href="/leave"
          color="#7c3aed"
          bg="#f5f3ff"
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} width={22} height={22}>
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          }
        />
      </div>

      {/* Recent employees table */}
      <div className="card">
        <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>
            最近追加した従業員
          </h2>
          <Link href="/employees" style={{
            fontSize: '0.8rem',
            color: '#2563eb',
            textDecoration: 'none',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
          }}>
            すべて見る →
          </Link>
        </div>

        {recentEmployees.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👤</div>
            <p style={{ margin: 0, fontSize: '0.875rem' }}>従業員が登録されていません</p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>氏名</th>
                <th>部署</th>
                <th>メールアドレス</th>
              </tr>
            </thead>
            <tbody>
              {recentEmployees.map((e) => (
                <tr key={e.id}>
                  <td style={{ fontWeight: 500 }}>{e.name}</td>
                  <td>
                    <span style={{
                      background: '#eff6ff',
                      color: '#2563eb',
                      padding: '2px 10px',
                      borderRadius: '999px',
                      fontSize: '0.78rem',
                      fontWeight: 500,
                    }}>{e.department}</span>
                  </td>
                  <td style={{ color: '#64748b' }}>{e.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function StatCard({
  title, value, unit, href, color, bg, icon,
}: {
  title: string
  value: number
  unit: string
  href: string
  color: string
  bg: string
  icon: React.ReactNode
}) {
  return (
    <Link href={href} style={{ textDecoration: 'none' }}>
      <div className="card stat-card" style={{
        padding: '1.5rem',
        cursor: 'pointer',
        borderTop: `3px solid ${color}`,
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', fontWeight: 500, marginBottom: '0.5rem' }}>{title}</p>
            <p style={{ margin: 0, fontSize: '2.25rem', fontWeight: 700, color: '#0f172a', lineHeight: 1 }}>
              {value}
              <span style={{ fontSize: '1rem', fontWeight: 500, color: '#64748b', marginLeft: '4px' }}>{unit}</span>
            </p>
          </div>
          <div style={{
            background: bg,
            color,
            borderRadius: '10px',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </div>
        </div>
      </div>
    </Link>
  )
}
