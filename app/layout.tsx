import type { Metadata } from 'next'
import './globals.css'
import Link from 'next/link'
import { getSession } from '@/lib/auth-server'
import { logout } from '@/app/actions/auth'

export const metadata: Metadata = {
  title: '総務管理ダッシュボード',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()

  return (
    <html lang="ja">
      <body className="min-h-screen" style={{ background: '#f1f5f9' }}>
        {session && (
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
                {session.role === 'admin' && (
                  <NavLink href="/users" label="ユーザー" icon="🔑" />
                )}
              </div>

              {/* Right side: user info + logout */}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.85)', fontSize: '0.82rem' }}>
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '50%',
                    background: 'rgba(255,255,255,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '12px', fontWeight: 700,
                  }}>
                    {session.name.charAt(0)}
                  </div>
                  <span>{session.name}</span>
                  {session.role === 'admin' && (
                    <span style={{
                      background: 'rgba(255,255,255,0.15)', borderRadius: '4px',
                      padding: '1px 6px', fontSize: '0.7rem', fontWeight: 600,
                    }}>管理者</span>
                  )}
                </div>
                <form action={logout}>
                  <button type="submit" style={{
                    background: 'rgba(255,255,255,0.12)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'rgba(255,255,255,0.85)',
                    borderRadius: '8px',
                    padding: '5px 12px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                  }}>
                    ログアウト
                  </button>
                </form>
              </div>
            </div>
          </nav>
        )}

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
