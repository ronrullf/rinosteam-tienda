'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '@/context/StoreContext'
import { buildWhatsAppUrl, formatPriceByCountry } from '@/lib/utils'
import type { Country } from '@/types'

const REVIEWS = [
  { user: '@carlos_gamer89',    stars: 5, text: 'Servicio demasiado bueno 100% recomendados, mucha confianza y rapidez 🔥' },
  { user: '@josebellidoarroyo', stars: 5, text: 'Lo recomiendo 100% confiable, ya he pasado más de 50 compras con ellos.' },
  { user: '@maderoandy7',       stars: 5, text: 'Excelente servicio, compré Black Myth Wukong y sin problemas 💕' },
  { user: '@luisito_cl',        stars: 5, text: 'Compré el RE4 Remake, precio imbatible y cuenta llegó al instante 💯' },
  { user: '@pepito_plays',      stars: 5, text: 'Llevo más de 10 juegos comprados, nunca he tenido problemas. Los mejores!' },
]

// Venezuela: Pago Móvil | Binance | PayPal (middle) | Zinli
// Chile:     Transferencia | PayPal (middle)
const PAYMENT_VE = [
  { icon: '📱', label: 'Pago Móvil' },
  { icon: '₿',  label: 'Binance' },
  { icon: '🅿️', label: 'PayPal', note: '+40%', highlight: true },
  { icon: '💜', label: 'Zinli' },
]
const PAYMENT_CL = [
  { icon: '🏦', label: 'Transferencia Bancaria' },
  { icon: '🅿️', label: 'PayPal', note: '+40%', highlight: true },
]

export function BuyModal() {
  const {
    isBuyModalOpen, setBuyModalOpen,
    selectedGame, setSelectedGame,
    country, setCountryPickerOpen,
    buyerName, setBuyerName,
    setTermsOpen,
  } = useStore()

  const [termsAccepted, setTermsAccepted] = useState(true)
  const [nameError, setNameError] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  function handleClose() {
    setBuyModalOpen(false)
    setSelectedGame(null)
    setNameError(false)
  }

  function handleContinue() {
    if (!buyerName.trim()) { setNameError(true); return }
    if (!selectedGame) return
    const countryLabel: Country = country === 'CL' ? 'Chile' : 'Venezuela'
    const priceDisplay = formatPriceByCountry(selectedGame.sale_price, country)
    const url = buildWhatsAppUrl(selectedGame.title, countryLabel, buyerName, priceDisplay)
    window.open(url, '_blank', 'noopener,noreferrer')
    handleClose()
  }

  const saleDisplay = selectedGame ? formatPriceByCountry(selectedGame.sale_price, country) : ''
  const origDisplay = selectedGame ? formatPriceByCountry(selectedGame.original_price, country) : ''
  const methods = country === 'VE' ? PAYMENT_VE : PAYMENT_CL

  const mobileVariants = { hidden: { y: '100%' }, visible: { y: 0 }, exit: { y: '100%' } }
  const desktopVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 0.95 } }

  const ModalContent = (
    <div className="flex flex-col overflow-hidden" style={{ maxHeight: '100%' }}>
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 py-3 flex-shrink-0 border-b"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
        <div>
          <p className="font-sans text-[10px] uppercase tracking-widest" style={{ color: 'var(--orange-400)' }}>Comprando</p>
          <p className="font-heading text-lg leading-tight" style={{ color: 'var(--text-primary)' }}>{selectedGame?.title}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-sans text-[11px] line-through" style={{ color: 'var(--text-muted)' }}>{origDisplay}</p>
            <p className="font-display text-2xl leading-none" style={{ color: 'var(--gold)' }}>{saleDisplay}</p>
          </div>
          <button onClick={handleClose} className="text-2xl leading-none" style={{ color: 'var(--text-muted)' }}>✕</button>
        </div>
      </div>

      {/* Scrollable body */}
      <div className="overflow-y-auto flex-1 flex flex-col gap-3 p-4">

        {/* ⚠️ LEER ANTES — blanco para contraste */}
        <div className="rounded-xl p-4" style={{ backgroundColor: '#ffffff', border: '2px solid #F97316' }}>
          <p className="font-heading text-base mb-2" style={{ color: '#EA580C' }}>⚠️ Leer antes de comprar</p>
          <div className="flex flex-col gap-1 font-sans text-[13px]" style={{ color: '#374151' }}>
            <p>❌ No son keys ni códigos de regalo</p>
            <p>✅ Te envío una cuenta de Steam</p>
            <p>✅ El juego se descarga y se juega en modo offline</p>
            <p>✔️ Sin cracks · Sin SteamTools ni programas externos</p>
            <p>✔️ Proceso rápido y sencillo</p>
            <p>✔️ No necesitas desconectar el internet para jugar</p>
          </div>
        </div>

        {/* 🎮 PASOS — fondo blanco */}
        <div className="rounded-xl p-4" style={{ backgroundColor: '#ffffff', border: '1px solid #e5e7eb' }}>
          <p className="font-heading text-base mb-3" style={{ color: '#1f2937' }}>🎮 Pasos del proceso</p>
          <div className="flex flex-col gap-2">
            {[
              { n: 1, text: 'Recibes la cuenta y descargas el juego legalmente desde Steam.' },
              { n: 2, text: 'Abres el juego y lo pruebas.', highlight: '🔴 Al salir, ACTIVAS MODO OFFLINE — es OBLIGATORIO.' },
              { n: 3, text: 'Realizas el pago y listo. Fácil, rápido y sencillo ✅' },
            ].map(({ n, text, highlight }) => (
              <div key={n} className="flex gap-3 items-start rounded-lg p-2.5"
                style={{ backgroundColor: n === 2 ? '#FFF7ED' : '#F9FAFB', border: `1px solid ${n === 2 ? '#FED7AA' : '#E5E7EB'}` }}>
                <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center font-heading text-sm text-white"
                  style={{ backgroundColor: '#F97316' }}>{n}</div>
                <div>
                  <p className="font-sans text-[13px]" style={{ color: '#374151' }}>{text}</p>
                  {highlight && <p className="font-sans text-[13px] font-bold mt-0.5" style={{ color: '#C2410C' }}>{highlight}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="rounded-xl border p-3" style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
            {country === 'CL' ? '🇨🇱' : '🇻🇪'} Métodos de pago
            {country === 'VE' && <span className="ml-1 normal-case" style={{ color: 'var(--orange-400)' }}>(tasa Binance)</span>}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {methods.map((m) => (
              <div key={m.label}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border"
                style={{
                  borderColor: m.highlight ? 'rgba(59,130,246,0.4)' : 'var(--border)',
                  backgroundColor: m.highlight ? 'rgba(59,130,246,0.08)' : 'var(--bg-modal)',
                }}>
                <span className="text-sm">{m.icon}</span>
                <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                {m.note && <span className="font-sans text-[10px] px-1 rounded" style={{ backgroundColor: 'rgba(249,115,22,0.2)', color: 'var(--orange-400)' }}>{m.note}</span>}
              </div>
            ))}
          </div>
          <button onClick={() => { handleClose(); setCountryPickerOpen(true) }}
            className="font-sans text-[11px] mt-2 underline" style={{ color: 'var(--text-muted)' }}>
            ¿Eres de otro país? Cambiar
          </button>
        </div>

        {/* Reviews */}
        <div>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-wide mb-2" style={{ color: 'var(--text-muted)' }}>
            📸 Lo que dicen en Instagram
          </p>
          <div className="flex flex-col gap-2">
            {REVIEWS.map((r) => (
              <div key={r.user} className="rounded-xl border p-3"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366)', color: '#fff' }}>
                    {r.user[1].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-sans text-[12px] font-semibold" style={{ color: 'var(--text-primary)' }}>{r.user}</p>
                    <p style={{ color: '#FCD34D', fontSize: '11px' }}>{'★'.repeat(r.stars)}</p>
                  </div>
                </div>
                <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>{r.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer sticky */}
      <div className="flex-shrink-0 border-t p-4 flex flex-col gap-3"
        style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}>
        <input type="text" placeholder="Coloca tu nombre para continuar..."
          value={buyerName} onChange={(e) => { setBuyerName(e.target.value); setNameError(false) }}
          className="input-dark" style={nameError ? { borderColor: '#EF4444' } : {}} />
        {nameError && <p className="font-sans text-[12px]" style={{ color: '#EF4444' }}>Por favor ingresa tu nombre</p>}

        <label className="flex items-start gap-2 cursor-pointer">
          <input type="checkbox" checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-0.5 w-4 h-4 accent-orange-500 flex-shrink-0" />
          <span className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
            Acepto los{' '}
            <button type="button" onClick={() => setTermsOpen(true)} className="underline" style={{ color: 'var(--orange-400)' }}>
              Términos y Condiciones
            </button>
          </span>
        </label>

        {/* GREEN WhatsApp button */}
        <button onClick={handleContinue} disabled={!termsAccepted}
          className="w-full font-heading text-lg py-3 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          style={{
            backgroundColor: termsAccepted ? '#25D366' : 'var(--bg-elevated)',
            color: termsAccepted ? '#fff' : 'var(--text-muted)',
            cursor: termsAccepted ? 'pointer' : 'not-allowed',
          }}>
          <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
            <path d="M16.002 3C9.374 3 4 8.373 4 15c0 2.388.67 4.617 1.832 6.514L4 29l7.697-1.812A12.93 12.93 0 0016.002 28C22.629 28 28 22.627 28 16S22.629 3 16.002 3zm0 23.5c-2.09 0-4.045-.578-5.72-1.578l-.41-.244-4.573 1.076 1.098-4.445-.267-.432A10.47 10.47 0 015.5 15c0-5.79 4.71-10.5 10.502-10.5C21.793 4.5 26.5 9.21 26.5 15s-4.707 10.5-10.498 10.5zM21.877 18.15c-.304-.152-1.8-.887-2.08-.988-.278-.101-.48-.152-.682.152s-.783.988-.96 1.191c-.176.202-.353.228-.656.076-.303-.152-1.28-.472-2.438-1.504-.9-.803-1.508-1.796-1.685-2.1-.176-.303-.019-.467.133-.618.136-.135.303-.353.455-.53.152-.176.202-.303.303-.505.102-.203.051-.38-.025-.53-.076-.153-.682-1.644-.934-2.25-.247-.59-.498-.51-.682-.52l-.58-.01c-.202 0-.53.076-.808.38s-1.061 1.036-1.061 2.527 1.086 2.93 1.237 3.132c.152.202 2.136 3.26 5.178 4.572.724.312 1.288.499 1.728.638.726.23 1.388.198 1.91.12.582-.087 1.8-.735 2.055-1.444.253-.709.253-1.317.177-1.444-.076-.126-.277-.202-.58-.354z" />
          </svg>
          CONTINUAR A WHATSAPP →
        </button>
      </div>
    </div>
  )

  return (
    <AnimatePresence>
      {isBuyModalOpen && (
        <>
          <motion.div className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={handleClose} />

          {isDesktop ? (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div className="w-full max-w-lg rounded-2xl border-2 overflow-hidden flex flex-col"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--orange-500)', maxHeight: '90vh' }}
                variants={desktopVariants} initial="hidden" animate="visible" exit="exit"
                transition={{ type: 'tween', duration: 0.2 }}>
                {ModalContent}
              </motion.div>
            </div>
          ) : (
            <motion.div className="fixed inset-x-0 bottom-0 z-50 safe-bottom"
              drag="y" dragConstraints={{ top: 0 }} dragElastic={0.15}
              onDragEnd={(_, info) => { if (info.offset.y > 80) handleClose() }}
              variants={mobileVariants} initial="hidden" animate="visible" exit="exit"
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}>
              <div className="border-t-2 flex flex-col overflow-hidden"
                style={{ backgroundColor: 'var(--bg-surface)', borderTopLeftRadius: '20px', borderTopRightRadius: '20px', borderColor: 'var(--orange-500)', maxHeight: '92vh' }}>
                <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
                  <div className="w-10 h-1 rounded-full" style={{ backgroundColor: 'var(--text-muted)' }} />
                </div>
                {ModalContent}
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  )
}
