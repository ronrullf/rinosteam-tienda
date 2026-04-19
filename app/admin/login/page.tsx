'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/Button'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Credenciales incorrectas. Verifica tu email y contraseña.')
      setLoading(false)
      return
    }

    router.push('/admin/dashboard')
    router.refresh()
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* Card: más ancha en desktop, compacta en mobile */}
      <div
        className="w-full max-w-sm sm:max-w-md rounded-2xl border p-8 sm:p-10"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-2">
          <span className="text-5xl">🦏</span>
          <h1 className="font-display text-3xl sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            RINO<span style={{ color: 'var(--orange-500)' }}>STEAM</span>
          </h1>
          <span
            className="font-sans text-sm font-medium px-3 py-1 rounded-full border"
            style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}
          >
            Panel de administración
          </span>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label
              htmlFor="email"
              className="block font-sans text-[13px] font-medium mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@rinosteam.com"
              className="input-dark"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block font-sans text-[13px] font-medium mb-1.5"
              style={{ color: 'var(--text-secondary)' }}
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              className="input-dark"
            />
          </div>

          {error && (
            <p
              className="font-sans text-[13px] text-center py-2.5 px-3 rounded-lg"
              style={{
                color: 'var(--danger)',
                backgroundColor: 'rgba(239,68,68,0.1)',
                border: '1px solid rgba(239,68,68,0.3)',
              }}
            >
              {error}
            </p>
          )}

          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={loading}
            className="mt-2 font-heading tracking-wide text-base"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <LoadingSpinner size="sm" />
                Entrando...
              </span>
            ) : (
              'ENTRAR AL PANEL'
            )}
          </Button>
        </form>

        <p
          className="text-center font-sans text-[12px] mt-6"
          style={{ color: 'var(--text-muted)' }}
        >
          Solo acceso autorizado · RinoSteam
        </p>
      </div>
    </div>
  )
}
