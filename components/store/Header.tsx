'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useStore } from '@/context/StoreContext'

function randomViewers() {
  return Math.floor(Math.random() * 16) + 10 // 10-25
}

export function Header() {
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const { searchQuery, setSearchQuery, country, setCountryPickerOpen, cartItems, setCartOpen } = useStore()
  const [viewers, setViewers] = useState(0)
  const [mounted, setMounted] = useState(false)
  const [logoLoaded, setLogoLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
    setViewers(randomViewers())
    function schedule() {
      const delay = Math.floor(Math.random() * 3000) + 4000
      return setTimeout(() => {
        setViewers(randomViewers())
        timerRef = schedule()
      }, delay)
    }
    let timerRef = schedule()
    return () => clearTimeout(timerRef)
  }, [])

  const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '584262031630'
  const waConsultUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola! Tengo una consulta sobre RinoSteam 👋')}`

  const countryLabel = country === 'CL' ? '🇨🇱 CLP' : country === 'VE' ? '🇻🇪 USD' : '🌍'

  return (
    <header
      className="sticky top-0 z-40 border-b backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(19,10,4,0.95)', borderColor: 'var(--border)' }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 md:h-16 flex items-center gap-2 sm:gap-3">

        {/* Logo */}
        {!mobileSearchOpen && (
          <a href="/" className="flex items-center gap-2 flex-shrink-0">
            {/* Logo image — se muestra solo cuando carga bien; si falla, usa el SVG */}
            <div className="relative w-8 h-8 md:w-9 md:h-9 flex-shrink-0">
              <Image
                src="/logo.png"
                alt="RinoSteam logo"
                fill
                className="object-contain"
                sizes="36px"
                priority
                onLoad={() => setLogoLoaded(true)}
                onError={() => setLogoLoaded(false)}
                style={{ display: logoLoaded ? 'block' : 'none' }}
              />
              {!logoLoaded && (
                <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="16" cy="16" r="16" fill="#1F1008" />
                  <path d="M8 22 C8 22 10 18 12 17 L12 14 C12 14 13 12 16 12 C19 12 21 13 22 15 L24 15 C25 15 26 16 25 17 L23 17 C23 19 21 21 18 21 L16 21 L14 23 Z" fill="#F97316" />
                  <path d="M13 14 L11 10 L14 13 Z" fill="#FB923C" />
                  <circle cx="20" cy="15" r="1" fill="#0D0703" />
                </svg>
              )}
            </div>
            <span className="font-display text-xl md:text-2xl leading-none" style={{ color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
              RINO<span style={{ color: 'var(--orange-500)' }}>STEAM</span>
            </span>
          </a>
        )}

        {/* PC/Steam badge */}
        {!mobileSearchOpen && (
          <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full flex-shrink-0"
            style={{ backgroundColor: 'rgba(30,120,200,0.12)', border: '1px solid rgba(30,120,200,0.25)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#63B3ED" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8m-4-4v4" />
            </svg>
            <span className="font-sans text-[10px] font-bold whitespace-nowrap" style={{ color: '#63B3ED' }}>
              Solo PC · Steam
            </span>
          </div>
        )}

        {/* Desktop search */}
        <div className="hidden md:flex flex-1 max-w-xs lg:max-w-sm xl:max-w-md mx-auto">
          <div className="relative w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{ color: 'var(--text-muted)' }}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
            </svg>
            <input
              type="search"
              placeholder="Buscar juego..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-dark w-full"
              style={{ paddingLeft: '34px', height: '38px', fontSize: '14px' }}
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1.5 sm:gap-2 ml-auto flex-shrink-0">

          {/* Viewers — desktop */}
          {mounted && (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full"
              style={{ backgroundColor: 'rgba(249,115,22,0.1)', border: '1px solid var(--border)' }}>
              <span className="viewer-dot w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: '#22C55E', display: 'inline-block' }} />
              <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                {viewers} viendo
              </span>
            </div>
          )}

          {/* Country switcher */}
          {country && (
            <button
              onClick={() => setCountryPickerOpen(true)}
              className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-full transition-all hover:opacity-80"
              style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
              title="Cambiar país"
            >
              <span className="font-sans text-[11px] font-semibold" style={{ color: 'var(--text-secondary)' }}>
                {countryLabel}
              </span>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} style={{ color: 'var(--text-muted)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}

          {/* Cart button */}
          <button
            onClick={() => setCartOpen(true)}
            className="relative p-2 rounded-lg transition-all hover:opacity-80 active:scale-95"
            style={{ color: 'var(--text-secondary)' }}
            aria-label="Carrito"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
              <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {cartItems.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                style={{ backgroundColor: 'var(--orange-500)', color: '#fff' }}>
                {cartItems.length}
              </span>
            )}
          </button>

          {/* WhatsApp "Consultar" button */}
          <a
            href={waConsultUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full font-sans text-[12px] font-semibold transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: '#25D366', color: '#fff', flexShrink: 0 }}
          >
            {/* WhatsApp icon */}
            <svg width="14" height="14" viewBox="0 0 32 32" fill="currentColor">
              <path d="M16.002 3C9.374 3 4 8.373 4 15c0 2.388.67 4.617 1.832 6.514L4 29l7.697-1.812A12.93 12.93 0 0016.002 28C22.629 28 28 22.627 28 16S22.629 3 16.002 3zm0 23.5c-2.09 0-4.045-.578-5.72-1.578l-.41-.244-4.573 1.076 1.098-4.445-.267-.432A10.47 10.47 0 015.5 15c0-5.79 4.71-10.5 10.502-10.5C21.793 4.5 26.5 9.21 26.5 15s-4.707 10.5-10.498 10.5zM21.877 18.15c-.304-.152-1.8-.887-2.08-.988-.278-.101-.48-.152-.682.152s-.783.988-.96 1.191c-.176.202-.353.228-.656.076-.303-.152-1.28-.472-2.438-1.504-.9-.803-1.508-1.796-1.685-2.1-.176-.303-.019-.467.133-.618.136-.135.303-.353.455-.53.152-.176.202-.303.303-.505.102-.203.051-.38-.025-.53-.076-.153-.682-1.644-.934-2.25-.247-.59-.498-.51-.682-.52l-.58-.01c-.202 0-.53.076-.808.38s-1.061 1.036-1.061 2.527 1.086 2.93 1.237 3.132c.152.202 2.136 3.26 5.178 4.572.724.312 1.288.499 1.728.638.726.23 1.388.198 1.91.12.582-.087 1.8-.735 2.055-1.444.253-.709.253-1.317.177-1.444-.076-.126-.277-.202-.58-.354z" />
            </svg>
            <span className="hidden sm:inline">Consultar</span>
          </a>

          {/* Mobile search toggle */}
          {!mobileSearchOpen && (
            <button
              onClick={() => setMobileSearchOpen(true)}
              className="md:hidden p-2 rounded-lg"
              style={{ color: 'var(--text-secondary)' }}
              aria-label="Buscar"
            >
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" d="m21 21-4.35-4.35" />
              </svg>
            </button>
          )}
        </div>

        {/* Mobile search expanded */}
        {mobileSearchOpen && (
          <div className="flex-1 flex items-center gap-2 md:hidden">
            <input
              autoFocus
              type="search"
              placeholder="Buscar juego..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-dark flex-1"
              style={{ height: '38px', padding: '0 12px', fontSize: '14px' }}
            />
            <button
              onClick={() => { setMobileSearchOpen(false); setSearchQuery('') }}
              className="font-sans text-[13px] flex-shrink-0"
              style={{ color: 'var(--text-secondary)' }}
            >
              Cancelar
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
