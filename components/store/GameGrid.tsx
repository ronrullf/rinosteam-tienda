'use client'

import { Game } from '@/types'
import { GameCard } from './GameCard'

interface GameGridProps {
  games: Game[]
}

export function GameGrid({ games }: GameGridProps) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <span className="text-6xl mb-4">👀</span>
        <p className="font-heading text-2xl" style={{ color: 'var(--text-secondary)' }}>
          Pronto más juegos disponibles
        </p>
        <p className="font-sans text-[14px] mt-2" style={{ color: 'var(--text-muted)' }}>
          Vuelve pronto 👀
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 md:py-7">
      {/*
        Columnas por breakpoint:
        - < 480px   → 2 col  (teléfonos pequeños)
        - 480–767px → 2 col  (teléfonos grandes / landscape)
        - 768–1023px → 3 col (tablets)
        - 1024–1279px → 4 col (laptops pequeñas)
        - 1280px+   → 5 col  (laptops / desktops)
      */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        {games.map((game, index) => (
          <GameCard
            key={game.id}
            game={game}
            index={index}
            featured={game.is_featured}
          />
        ))}
      </div>
    </div>
  )
}
