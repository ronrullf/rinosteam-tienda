'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '@/context/StoreContext'
import { buildWhatsAppUrl } from '@/lib/utils'
import type { Country } from '@/types'

const COUNTRIES: { code: Country; flag: string; label: string }[] = [
  { code: 'Chile', flag: '🇨🇱', label: 'CHILE' },
  { code: 'Venezuela', flag: '🇻🇪', label: 'VENEZUELA' },
]

export function CountryModal() {
  const { isCountryModalOpen, setCountryModalOpen, selectedGame, setSelectedGame } =
    useStore()

  function handleClose() {
    setCountryModalOpen(false)
    setSelectedGame(null)
  }

  function handleCountry(country: Country) {
    if (!selectedGame) return
    const url = buildWhatsAppUrl(selectedGame.title, country)
    window.open(url, '_blank', 'noopener,noreferrer')
    handleClose()
  }

  return (
    <AnimatePresence>
      {isCountryModalOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ backgroundColor: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />

          {/* Modal panel — slide-up desde abajo */}
          <motion.div
            className="fixed inset-x-0 bottom-0 z-50 mx-auto safe-bottom"
            style={{ maxWidth: '430px', left: '50%', transform: 'translateX(-50%)' }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 80) handleClose()
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            <div
              className="border-t-2 pt-2 px-5 pb-8"
              style={{
                backgroundColor: 'var(--bg-surface)',
                borderTopLeftRadius: '20px',
                borderTopRightRadius: '20px',
                borderColor: 'var(--orange-500)',
              }}
            >
              {/* Drag handle */}
              <div className="flex justify-center mb-4">
                <div
                  className="w-10 h-1 rounded-full"
                  style={{ backgroundColor: 'var(--text-muted)' }}
                />
              </div>

              {/* Botón cerrar */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-5 text-2xl leading-none"
                style={{ color: 'var(--text-muted)' }}
                aria-label="Cerrar"
              >
                ✕
              </button>

              {/* Juego seleccionado */}
              {selectedGame && (
                <p
                  className="font-heading text-base mb-1"
                  style={{ color: 'var(--orange-400)' }}
                >
                  {selectedGame.title}
                </p>
              )}

              {/* Título */}
              <h2
                className="font-heading text-2xl mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                ¿Desde dónde escribes?
              </h2>
              <p className="font-sans text-[14px] mb-6" style={{ color: 'var(--text-secondary)' }}>
                Selecciona tu país 🌍
              </p>

              {/* Botones país */}
              <div className="flex gap-4 justify-center mb-5">
                {COUNTRIES.map(({ code, flag, label }) => (
                  <button
                    key={code}
                    onClick={() => handleCountry(code)}
                    className="flex flex-col items-center justify-center gap-2 rounded-xl border transition-all duration-150 active:scale-95"
                    style={{
                      width: '140px',
                      height: '100px',
                      borderColor: 'var(--border)',
                      backgroundColor: 'var(--bg-elevated)',
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                        'var(--orange-500)'
                      ;(e.currentTarget as HTMLButtonElement).style.backgroundColor =
                        'var(--bg-elevated)'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                        'var(--border)'
                    }}
                  >
                    <span className="text-5xl leading-none" role="img" aria-label={label}>
                      {flag}
                    </span>
                    <span
                      className="font-heading text-lg"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Texto de confianza */}
              <p
                className="text-center font-sans text-[13px]"
                style={{ color: 'var(--text-muted)' }}
              >
                Te enviamos a WhatsApp para confirmar tu pedido
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
