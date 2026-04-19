'use client'

import { Game } from '@/types'
import { GameCard } from './GameCard'

interface GameGridProps {
  games: Game[]
}

export function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <span className="text-5xl mb-4">👀</span>
        <p
          className="font-heading text-xl"
          style={{ color: 'var(--text-secondary)' }}
        >
          Pronto más juegos disponibles
        </p>
      </div>
    )
  }

  return (
    <div
      className="grid px-3 py-4"
      style={{
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '10px',
      }}
    >
      {games.map((game, index) => (
        <GameCard
          key={game.id}
          game={game}
          index={index}
          featured={game.is_featured}
        />
      ))}
    </div>
  )
}
