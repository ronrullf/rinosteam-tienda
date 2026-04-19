'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { GameListAdmin } from '@/components/admin/GameListAdmin'
import { GameForm } from '@/components/admin/GameForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'
import type { Game } from '@/types'

type Tab = 'games' | 'add'

export default function AdminDashboard() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('games')
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [authChecked, setAuthChecked] = useState(false)

  // Verificar sesión
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.replace('/admin/login')
      } else {
        setAuthChecked(true)
      }
    })
  }, [router])

  const loadGames = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })
    setGames(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (authChecked) loadGames()
  }, [authChecked, loadGames])

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--bg-base)' }}>
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'games', label: `📋 Juegos (${games.length})` },
    { id: 'add', label: '➕ Añadir' },
  ]

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      <AdminHeader />

      {/* Tabs */}
      <div
        className="flex border-b"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      >
        {TABS.map((t) => {
          const active = tab === t.id
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="flex-1 py-3.5 font-sans text-[14px] font-medium transition-colors border-b-2"
              style={{
                borderColor: active ? 'var(--orange-500)' : 'transparent',
                color: active ? 'var(--orange-500)' : 'var(--text-secondary)',
                backgroundColor: active ? 'rgba(249,115,22,0.05)' : 'transparent',
              }}
            >
              {t.label}
            </button>
          )
        })}
      </div>

      {/* Contenido */}
      <div className="px-4 pt-5">
        {tab === 'games' ? (
          loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <GameListAdmin
              games={games}
              onRefresh={() => {
                loadGames()
              }}
            />
          )
        ) : (
          <GameForm
            onSuccess={() => {
              loadGames()
              setTab('games')
            }}
          />
        )}
      </div>
    </div>
  )
}
