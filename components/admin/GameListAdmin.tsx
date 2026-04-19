'use client'

import { useState } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { formatPrice } from '@/lib/utils'
import type { Game } from '@/types'
import { Button } from '@/components/ui/Button'
import { GameForm } from './GameForm'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface GameListAdminProps {
  games: Game[]
  onRefresh: () => void
}

export function GameListAdmin({ games, onRefresh }: GameListAdminProps) {
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(game: Game) {
    const confirmed = window.confirm(
      `¿Desactivar "${game.title}" de la tienda?\n\nEl juego se marcará como inactivo.`
    )
    if (!confirmed) return

    setDeletingId(game.id)
    try {
      const supabase = createClient()
      await supabase
        .from('games')
        .update({ is_active: false, updated_at: new Date().toISOString() })
        .eq('id', game.id)
      onRefresh()
    } finally {
      setDeletingId(null)
    }
  }

  if (editingGame) {
    return (
      <div className="max-w-xl">
        <button
          onClick={() => setEditingGame(null)}
          className="flex items-center gap-2 mb-5 font-sans text-[14px]"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← Volver al listado
        </button>
        <h2 className="font-heading text-2xl mb-5" style={{ color: 'var(--text-primary)' }}>
          Editar: {editingGame.title}
        </h2>
        <GameForm
          game={editingGame}
          onSuccess={() => { setEditingGame(null); onRefresh() }}
        />
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-5xl mb-3">📦</p>
        <p className="font-sans text-[15px]" style={{ color: 'var(--text-secondary)' }}>
          No hay juegos publicados todavía.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Contador */}
      <p className="font-sans text-[13px] mb-4" style={{ color: 'var(--text-muted)' }}>
        {games.length} juego{games.length !== 1 ? 's' : ''} en total
      </p>

      {/* Mobile: cards apiladas | Desktop: tabla */}
      <div className="hidden md:block rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
        <table className="w-full">
          <thead>
            <tr style={{ backgroundColor: 'var(--bg-elevated)', borderBottom: '1px solid var(--border)' }}>
              {['Juego', 'Categoría', 'Precio', 'Descuento', 'Estado', 'Acciones'].map(h => (
                <th
                  key={h}
                  className="text-left px-4 py-3 font-sans text-[12px] uppercase tracking-wide"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {games.map((game, i) => {
              const isDeleting = deletingId === game.id
              const discount = game.discount_pct ?? 0
              return (
                <tr
                  key={game.id}
                  style={{
                    backgroundColor: i % 2 === 0 ? 'var(--bg-surface)' : 'var(--bg-elevated)',
                    opacity: isDeleting ? 0.5 : 1,
                    borderBottom: '1px solid var(--border)',
                  }}
                >
                  {/* Juego */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 48, height: 48 }}>
                        <Image src={game.image_url} alt={game.title} fill className="object-cover" sizes="48px" />
                      </div>
                      <div>
                        <p className="font-heading text-[15px] leading-tight" style={{ color: 'var(--text-primary)' }}>
                          {game.title}
                        </p>
                        {game.is_featured && (
                          <span className="text-[11px]" style={{ color: 'var(--orange-400)' }}>🔥 Destacado</span>
                        )}
                      </div>
                    </div>
                  </td>
                  {/* Categoría */}
                  <td className="px-4 py-3">
                    <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                      {game.category}
                    </span>
                  </td>
                  {/* Precio */}
                  <td className="px-4 py-3">
                    <span className="font-heading text-[18px]" style={{ color: 'var(--gold)' }}>
                      {formatPrice(game.sale_price)}
                    </span>
                    <span className="block font-sans text-[11px] line-through" style={{ color: 'var(--text-muted)' }}>
                      {formatPrice(game.original_price)}
                    </span>
                  </td>
                  {/* Descuento */}
                  <td className="px-4 py-3">
                    {discount > 0 && (
                      <span
                        className="font-sans text-[12px] font-bold px-2 py-0.5 rounded"
                        style={{ backgroundColor: 'var(--orange-500)', color: '#fff' }}
                      >
                        -{discount}%
                      </span>
                    )}
                  </td>
                  {/* Estado */}
                  <td className="px-4 py-3">
                    <span
                      className="font-sans text-[12px] font-medium"
                      style={{ color: game.is_active ? 'var(--success)' : 'var(--danger)' }}
                    >
                      {game.is_active ? '✅ Activo' : '⛔ Inactivo'}
                    </span>
                  </td>
                  {/* Acciones */}
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="secondary" size="sm" onClick={() => setEditingGame(game)} disabled={isDeleting}>
                        ✏️ Editar
                      </Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(game)} disabled={isDeleting}>
                        {isDeleting ? <LoadingSpinner size="sm" /> : '🗑'}
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards apiladas */}
      <div className="flex flex-col gap-3 md:hidden">
        {games.map((game) => {
          const isDeleting = deletingId === game.id
          const discount = game.discount_pct ?? 0
          return (
            <div
              key={game.id}
              className="flex gap-3 rounded-xl border p-3 items-center"
              style={{
                backgroundColor: 'var(--bg-elevated)',
                borderColor: 'var(--border)',
                opacity: isDeleting ? 0.5 : 1,
              }}
            >
              <div className="relative flex-shrink-0 rounded-lg overflow-hidden" style={{ width: 60, height: 60 }}>
                <Image src={game.image_url} alt={game.title} fill className="object-cover" sizes="60px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-[16px] truncate" style={{ color: 'var(--text-primary)' }}>
                  {game.title}
                </p>
                <div className="flex items-center gap-2 flex-wrap mt-0.5">
                  <span className="font-heading text-[18px]" style={{ color: 'var(--gold)' }}>
                    {formatPrice(game.sale_price)}
                  </span>
                  {discount > 0 && (
                    <span
                      className="font-sans text-[11px] font-semibold px-1.5 py-0.5 rounded"
                      style={{ backgroundColor: 'var(--orange-500)', color: '#fff' }}
                    >
                      -{discount}%
                    </span>
                  )}
                  <span className="font-sans text-[11px]" style={{ color: game.is_active ? 'var(--success)' : 'var(--danger)' }}>
                    {game.is_active ? '✅' : '⛔'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 flex-shrink-0">
                <Button variant="secondary" size="sm" onClick={() => setEditingGame(game)} disabled={isDeleting}>
                  ✏️
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(game)} disabled={isDeleting}>
                  {isDeleting ? <LoadingSpinner size="sm" /> : '🗑'}
                </Button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
