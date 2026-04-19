'use client'

import { useEffect, useState } from 'react'

function getSecondsUntilMidnight() {
  const now = new Date()
  const midnight = new Date()
  midnight.setHours(24, 0, 0, 0)
  return Math.floor((midnight.getTime() - now.getTime()) / 1000)
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function CountdownBanner() {
  const [secs, setSecs] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setSecs(getSecondsUntilMidnight())
    setMounted(true)
    const interval = setInterval(() => {
      setSecs(getSecondsUntilMidnight())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60

  function Digit({ val, label }: { val: string; label: string }) {
    return (
      <div className="flex flex-col items-center">
        <div
          className="font-display text-xl sm:text-2xl px-2.5 py-1 rounded-lg min-w-[2.5rem] text-center leading-none"
          style={{ backgroundColor: 'rgba(249,115,22,0.2)', color: 'var(--orange-400)' }}
        >
          {val}
        </div>
        <span className="font-sans text-[9px] mt-0.5 uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
      </div>
    )
  }

  return (
    <div
      className="w-full py-2.5 px-4"
      style={{
        background: 'linear-gradient(90deg, rgba(249,115,22,0.12) 0%, rgba(249,115,22,0.04) 100%)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 sm:gap-6 flex-wrap">
        <p className="font-sans text-[12px] sm:text-[13px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
          🔥 Oferta termina en:
        </p>
        {mounted ? (
          <div className="flex items-center gap-1.5">
            <Digit val={pad(h)} label="hrs" />
            <span className="font-display text-xl" style={{ color: 'var(--orange-500)' }}>:</span>
            <Digit val={pad(m)} label="min" />
            <span className="font-display text-xl" style={{ color: 'var(--orange-500)' }}>:</span>
            <Digit val={pad(s)} label="seg" />
          </div>
        ) : (
          <div className="flex items-center gap-1.5">
            <Digit val="--" label="hrs" />
            <span className="font-display text-xl" style={{ color: 'var(--orange-500)' }}>:</span>
            <Digit val="--" label="min" />
            <span className="font-display text-xl" style={{ color: 'var(--orange-500)' }}>:</span>
            <Digit val="--" label="seg" />
          </div>
        )}
        <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
          ⚡ Entrega inmediata · +100 compras realizadas
        </p>
      </div>
    </div>
  )
}
