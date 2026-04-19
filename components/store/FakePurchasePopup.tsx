'use client'

import { useEffect, useState } from 'react'
import { useStore } from '@/context/StoreContext'

const FAKE_USERS = [
  'marcus242', 'carlos_g', 'jose_ve', 'player2024', 'luisito_cl',
  'alexgamer', 'pepito123', 'mario_ve', 'gamer_pro', 'andres_cl',
  'felipe_gm', 'diego2024', 'gamer_boy', 'dark_wolf', 'ramiro_ve',
  'nicolas_cl', 'kevin2024', 'cristian_g', 'pablo_ve', 'jorge_cl',
]

type Action = 'comprar' | 'carrito'

function randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export function FakePurchasePopup() {
  const { gamesList } = useStore()
  const [visible, setVisible] = useState(false)
  const [current, setCurrent] = useState<{ user: string; game: string; action: Action } | null>(null)
  const [exiting, setExiting] = useState(false)

  useEffect(() => {
    if (gamesList.length === 0) return

    let showTimer: ReturnType<typeof setTimeout>
    let hideTimer: ReturnType<typeof setTimeout>

    function showNext() {
      const user = FAKE_USERS[randomBetween(0, FAKE_USERS.length - 1)]
      const game = gamesList[randomBetween(0, gamesList.length - 1)]
      const action: Action = Math.random() > 0.45 ? 'comprar' : 'carrito'
      setCurrent({ user, game: game.title, action })
      setExiting(false)
      setVisible(true)

      hideTimer = setTimeout(() => {
        setExiting(true)
        setTimeout(() => setVisible(false), 400)
      }, 4000)

      showTimer = setTimeout(showNext, randomBetween(10000, 18000))
    }

    showTimer = setTimeout(showNext, 6000)

    return () => {
      clearTimeout(showTimer)
      clearTimeout(hideTimer)
    }
  }, [gamesList])

  if (!visible || !current) return null

  const isCart = current.action === 'carrito'

  return (
    <div
      className="fixed bottom-20 left-4 z-30 max-w-[290px]"
      style={{
        animation: exiting
          ? 'slide-out-bottom 0.35s ease-in forwards'
          : 'slide-in-bottom 0.45s cubic-bezier(.22,1,.36,1) forwards',
      }}
    >
      <div
        className="flex items-center gap-3 rounded-xl border px-3 py-2.5 shadow-xl"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: 'var(--border-strong)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        }}
      >
        <div
          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-lg"
          style={{ backgroundColor: isCart ? 'rgba(34,197,94,0.15)' : 'rgba(249,115,22,0.15)' }}
        >
          {isCart ? '🛒' : '🎮'}
        </div>
        <div className="min-w-0">
          <p className="font-sans text-[12px] font-semibold truncate" style={{ color: 'var(--text-primary)' }}>
            {current.user}
          </p>
          <p className="font-sans text-[11px]" style={{ color: 'var(--text-secondary)' }}>
            {isCart ? 'añadió al carrito' : 'acaba de comprar'}{' '}
            <span style={{ color: 'var(--orange-400)' }}>{current.game}</span>
          </p>
          <p className="font-sans text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
            hace unos segundos · {isCart ? '🛒 en carrito' : '✅ verificado'}
          </p>
        </div>
      </div>
    </div>
  )
}
