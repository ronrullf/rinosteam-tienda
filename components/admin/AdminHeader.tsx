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
      className="sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b"
      style={{
        backgroundColor: 'rgba(19,10,4,0.95)',
        backdropFilter: 'blur(8px)',
        borderColor: 'var(--border)',
      }}
    >
      <span
        className="font-display text-xl"
        style={{ color: 'var(--text-primary)' }}
      >
        🦏 RINO<span style={{ color: 'var(--orange-500)' }}>STEAM</span>{' '}
        <span
          className="font-sans font-normal text-sm ml-1"
          style={{ color: 'var(--text-muted)' }}
        >
          Admin
        </span>
      </span>

      <Button variant="ghost" size="sm" onClick={handleLogout}>
        Cerrar sesión
      </Button>
    </header>
  )
}
