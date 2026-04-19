'use client'

import { useState, useMemo } from 'react'
import { CategoryFilter } from './CategoryFilter'
import { GameGrid } from './GameGrid'
import { useStore } from '@/context/StoreContext'
import type { Game } from '@/types'

interface GameGridContainerProps {
  initialGames: Game[]
}

export function GameGridContainer({ initialGames }: GameGridContainerProps) {
  const [activeCategory, setActiveCategory] = useState('Todos')
  const { searchQuery } = useStore()

  const filtered = useMemo(() => {
    let list = initialGames

    if (activeCategory !== 'Todos') {
      list = list.filter((g) => g.category === activeCategory)
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter((g) => g.title.toLowerCase().includes(q))
    }

    return list
  }, [initialGames, activeCategory, searchQuery])

  return (
    <>
      <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      <GameGrid games={filtered} />
    </>
  )
}
