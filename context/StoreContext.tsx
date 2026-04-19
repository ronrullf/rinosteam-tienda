'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import type { Game, CartItem } from '@/types'

export type CountryCode = 'CL' | 'VE' | null

interface StoreContextType {
  selectedGame: Game | null
  setSelectedGame: (game: Game | null) => void

  isBuyModalOpen: boolean
  setBuyModalOpen: (open: boolean) => void

  country: CountryCode
  setCountry: (c: CountryCode) => void
  isCountryPickerOpen: boolean
  setCountryPickerOpen: (open: boolean) => void

  searchQuery: string
  setSearchQuery: (q: string) => void

  buyerName: string
  setBuyerName: (n: string) => void

  isTermsOpen: boolean
  setTermsOpen: (open: boolean) => void

  gamesList: Game[]
  setGamesList: (games: Game[]) => void

  // Tasa Bs Venezuela (promedio API + 50)
  bsRate: number | null

  // Cart
  cartItems: CartItem[]
  addToCart: (game: Game, discounted?: boolean) => void
  removeFromCart: (gameId: string) => void
  clearCart: () => void
  isCartOpen: boolean
  setCartOpen: (open: boolean) => void

  // Legacy alias
  isCountryModalOpen: boolean
  setCountryModalOpen: (open: boolean) => void
}

const StoreContext = createContext<StoreContextType | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [isBuyModalOpen, setBuyModalOpen] = useState(false)
  const [country, setCountryState] = useState<CountryCode>(null)
  const [isCountryPickerOpen, setCountryPickerOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [buyerName, setBuyerName] = useState('')
  const [isTermsOpen, setTermsOpen] = useState(false)
  const [gamesList, setGamesList] = useState<Game[]>([])
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [isCartOpen, setCartOpen] = useState(false)
  const [bsRate, setBsRate] = useState<number | null>(null)

  // Fetch tasa paralelo Venezuela al iniciar (promedio + 50 Bs de margen)
  useEffect(() => {
    fetch('https://ve.dolarapi.com/v1/dolares/paralelo')
      .then(r => r.json())
      .then(data => {
        if (typeof data.promedio === 'number') {
          setBsRate(data.promedio + 50)
        }
      })
      .catch(() => {}) // falla silenciosamente → muestra USD
  }, [])

  // Leer país guardado en localStorage
  useEffect(() => {
    const stored = localStorage.getItem('rinosteam_country') as CountryCode
    if (stored === 'CL' || stored === 'VE') {
      setCountryState(stored)
    } else {
      setCountryPickerOpen(true)
    }
  }, [])

  function setCountry(c: CountryCode) {
    setCountryState(c)
    if (c) localStorage.setItem('rinosteam_country', c)
    setCountryPickerOpen(false)
  }

  function addToCart(game: Game, discounted = false) {
    setCartItems(prev => {
      if (prev.find(i => i.game.id === game.id)) return prev
      return [...prev, { game, discounted }]
    })
    setCartOpen(true)
  }

  function removeFromCart(gameId: string) {
    setCartItems(prev => prev.filter(i => i.game.id !== gameId))
  }

  function clearCart() {
    setCartItems([])
  }

  return (
    <StoreContext.Provider value={{
      selectedGame, setSelectedGame,
      isBuyModalOpen, setBuyModalOpen,
      country, setCountry,
      isCountryPickerOpen, setCountryPickerOpen,
      searchQuery, setSearchQuery,
      buyerName, setBuyerName,
      isTermsOpen, setTermsOpen,
      gamesList, setGamesList,
      bsRate,
      cartItems, addToCart, removeFromCart, clearCart,
      isCartOpen, setCartOpen,
      isCountryModalOpen: isBuyModalOpen,
      setCountryModalOpen: setBuyModalOpen,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
