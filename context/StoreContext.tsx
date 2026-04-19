'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import type { Game } from '@/types'

interface StoreContextType {
  selectedGame: Game | null
  setSelectedGame: (game: Game | null) => void
  isCountryModalOpen: boolean
  setCountryModalOpen: (open: boolean) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isCountryModalOpen, setCountryModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <StoreContext.Provider
      value={{
        selectedGame,
        setSelectedGame,
        isCountryModalOpen,
        setCountryModalOpen,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
