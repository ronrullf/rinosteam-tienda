'use client'

import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'

export function AdminHeader() {
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  return (
    <header
      className="sticky top-0 z-40 border-b"
      style={{
        backgroundColor: 'rgba(19,10,4,0.95)',
        backdropFilter: 'blur(8px)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 md:h-16 flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="font-display text-xl md:text-2xl" style={{ color: 'var(--text-primary)' }}>
            🦏 RINO<span style={{ color: 'var(--orange-500)' }}>STEAM</span>
          </span>
          <span
            className="font-sans font-normal text-sm hidden sm:inline"
            style={{ color: 'var(--text-muted)' }}
          >
            · Admin
          </span>
        </a>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          Cerrar sesión
        </Button>
      </div>
    </header>
  )
}
