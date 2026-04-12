import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '総務管理ダッシュボード',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body className="min-h-screen" style={{ background: '#f1f5f9' }}>
        <nav style={{
          background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)',
          boxShadow: '0 2px 16px rgba(29,78,216,0.18)',
        }}>
          <div className="max-w-6xl mx-auto px-6 py-0 flex items-center gap-8" style={{ height: '60px' }}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 text-white no-underline" style={{ textDecoration: 'none' }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '8px',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}>🏢</span>
              <span style={{ fontWeight: 700, fontSize: '1rem', letterSpacing: '0.02em' }}>総務管理</span>
            </Link>

            {/* Divider */}
            <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.2)' }} />

            {/* Nav links */}
            <div className="flex items-center gap-1">
              <NavLink href="/" label="ダッシュボード" icon="▦" />
              <NavLink href="/employees" label="従業員" icon="👤" />
              <NavLink href="/equipment" label="備品" icon="📦" />
              <NavLink href="/overtime" label="残業申請" icon="🕐" />
              <NavLink href="/leave" label="有休申請" icon="📅" />
            </div>
          </div>
        </nav>

        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  )
}

function NavLink({ href, label, icon }: { href: string; label: string; icon: string }) {
  return (
    <Link href={href} style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      color: 'rgba(255,255,255,0.85)',
      textDecoration: 'none',
      padding: '6px 14px',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: 'all 0.15s',
    }}
    className="nav-link"
    >
      <span style={{ fontSize: '13px' }}>{icon}</span>
      {label}
    </Link>
  )
}
