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
      <div>
        <button
          onClick={() => setEditingGame(null)}
          className="flex items-center gap-2 mb-5 font-sans text-[14px]"
          style={{ color: 'var(--text-secondary)' }}
        >
          ← Volver al listado
        </button>
        <h2
          className="font-heading text-2xl mb-5"
          style={{ color: 'var(--text-primary)' }}
        >
          Editar: {editingGame.title}
        </h2>
        <GameForm
          game={editingGame}
          onSuccess={() => {
            setEditingGame(null)
            onRefresh()
          }}
        />
      </div>
    )
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📦</p>
        <p
          className="font-sans text-[15px]"
          style={{ color: 'var(--text-secondary)' }}
        >
          No hay juegos publicados todavía.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {games.map((game) => {
        const discount = game.discount_pct ?? 0
        const isDeleting = deletingId === game.id

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
            {/* Imagen */}
            <div
              className="relative flex-shrink-0 rounded-lg overflow-hidden"
              style={{ width: '60px', height: '60px' }}
            >
              <Image
                src={game.image_url}
                alt={game.title}
                fill
                className="object-cover"
                sizes="60px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p
                className="font-heading text-[16px] truncate"
                style={{ color: 'var(--text-primary)' }}
              >
                {game.title}
              </p>
              <div className="flex items-center gap-2 flex-wrap mt-0.5">
                <span
                  className="font-heading text-[18px]"
                  style={{ color: 'var(--gold)' }}
                >
                  {formatPrice(game.sale_price)}
                </span>
                {discount > 0 && (
                  <span
                    className="font-sans text-[11px] font-semibold px-1.5 py-0.5 rounded"
                    style={{
                      backgroundColor: 'var(--orange-500)',
                      color: '#fff',
                    }}
                  >
                    -{discount}%
                  </span>
                )}
                <span
                  className="font-sans text-[11px]"
                  style={{ color: game.is_active ? 'var(--success)' : 'var(--danger)' }}
                >
                  {game.is_active ? '✅ Activo' : '⛔ Inactivo'}
                </span>
              </div>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-1.5 flex-shrink-0">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setEditingGame(game)}
                disabled={isDeleting}
              >
                ✏️ Editar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(game)}
                disabled={isDeleting}
              >
                {isDeleting ? <LoadingSpinner size="sm" /> : '🗑 Quitar'}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
