'use client'

import { useState } from 'react'
import { useStore } from '@/context/StoreContext'

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false)
  const { searchQuery, setSearchQuery } = useStore()

  return (
    <header
      className="sticky top-0 z-40 border-b flex items-center px-3 gap-2 h-14 backdrop-blur-sm"
      style={{
        backgroundColor: 'rgba(19,10,4,0.92)',
        borderColor: 'var(--border)',
      }}
    >
      {/* Logo */}
      {!searchOpen && (
        <a href="/" className="flex items-center gap-2 flex-1">
          {/* Rhino SVG */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <circle cx="16" cy="16" r="16" fill="#1F1008" />
            {/* Simplified rhino silhouette */}
            <path
              d="M8 22 C8 22 10 18 12 17 L12 14 C12 14 13 12 16 12 C19 12 21 13 22 15 L24 15 C25 15 26 16 25 17 L23 17 C23 19 21 21 18 21 L16 21 L14 23 Z"
              fill="#F97316"
            />
            {/* Horn */}
            <path
              d="M13 14 L11 10 L14 13 Z"
              fill="#FB923C"
            />
            {/* Eye */}
            <circle cx="20" cy="15" r="1" fill="#0D0703" />
          </svg>

          <span
            className="font-display text-2xl leading-none"
            style={{ color: 'var(--text-primary)', letterSpacing: '0.02em' }}
          >
            RINO<span style={{ color: 'var(--orange-500)' }}>STEAM</span>
          </span>
        </a>
      )}

      {/* Buscador inline */}
      {searchOpen && (
        <div className="flex-1 flex items-center gap-2">
          <input
            autoFocus
            type="search"
            placeholder="Buscar juego..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input-dark flex-1"
            style={{ height: '40px', padding: '0 12px' }}
          />
          <button
            onClick={() => {
              setSearchOpen(false)
              setSearchQuery('')
            }}
            className="font-sans text-[13px]"
            style={{ color: 'var(--text-secondary)' }}
          >
            Cancelar
          </button>
        </div>
      )}

      {/* Iconos */}
      {!searchOpen && (
        <button
          onClick={() => setSearchOpen(true)}
          className="p-2 rounded-lg"
          style={{ color: 'var(--text-secondary)' }}
          aria-label="Buscar"
        >
          <svg
            width="20"
            height="20"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <circle cx="11" cy="11" r="8" />
            <path strokeLinecap="round" d="m21 21-4.35-4.35" />
          </svg>
        </button>
      )}
    </header>
  )
}
