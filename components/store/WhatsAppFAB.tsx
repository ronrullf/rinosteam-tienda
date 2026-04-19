'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const WA_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '584262301632'
const WA_URL = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent('Hola, quiero información sobre los juegos disponibles en RinoSteam 🎮')}`

export function WhatsAppFAB() {
  const [visible, setVisible] = useState(false)
  const [showLabel, setShowLabel] = useState(false)

  // Aparece 2 segundos después de que carga la página
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 2000)
    // Label aparece 3.5s después del botón, se oculta a los 5s
    const t2 = setTimeout(() => setShowLabel(true), 3500)
    const t3 = setTimeout(() => setShowLabel(false), 8000)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed bottom-6 right-4 sm:right-6 z-50 flex items-center gap-3"
          initial={{ opacity: 0, scale: 0.5, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.5, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        >
          {/* Label flotante */}
          <AnimatePresence>
            {showLabel && (
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
                className="px-3 py-2 rounded-xl font-sans text-[13px] font-semibold whitespace-nowrap shadow-lg"
                style={{
                  backgroundColor: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
              >
                ¿Dudas? ¡Escríbenos! 💬
              </motion.div>
            )}
          </AnimatePresence>

          {/* Botón */}
          <a
            href={WA_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Contactar por WhatsApp"
            className="relative flex items-center justify-center rounded-full shadow-2xl"
            style={{
              width: '58px',
              height: '58px',
              backgroundColor: '#25D366',
              boxShadow: '0 4px 20px rgba(37,211,102,0.45)',
            }}
          >
            {/* Aro de pulse */}
            <span
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: '#25D366',
                animation: 'wa-pulse 2.5s ease-out infinite',
                opacity: 0,
              }}
            />

            {/* Ícono WhatsApp SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              width="30"
              height="30"
              aria-hidden="true"
            >
              <path
                fill="#fff"
                d="M24 4C12.95 4 4 12.95 4 24c0 3.55.93 6.88 2.56 9.77L4 44l10.5-2.5A19.86 19.86 0 0 0 24 44c11.05 0 20-8.95 20-20S35.05 4 24 4zm0 36c-3.14 0-6.1-.82-8.66-2.25l-.62-.37-6.23 1.49 1.55-6.06-.4-.65A15.93 15.93 0 0 1 8 24c0-8.82 7.18-16 16-16s16 7.18 16 16-7.18 16-16 16zm8.77-11.9c-.48-.24-2.84-1.4-3.28-1.56-.44-.16-.76-.24-1.08.24-.32.48-1.24 1.56-1.52 1.88-.28.32-.56.36-1.04.12-.48-.24-2.02-.74-3.85-2.36-1.42-1.26-2.38-2.82-2.66-3.3-.28-.48-.03-.74.21-.98.22-.22.48-.56.72-.84.24-.28.32-.48.48-.8.16-.32.08-.6-.04-.84-.12-.24-1.08-2.6-1.48-3.56-.39-.93-.78-.8-1.08-.82-.28-.01-.6-.01-.92-.01-.32 0-.84.12-1.28.6-.44.48-1.68 1.64-1.68 4 0 2.36 1.72 4.64 1.96 4.96.24.32 3.38 5.16 8.2 7.24 1.15.5 2.04.79 2.74 1.01 1.15.37 2.2.32 3.03.19.92-.14 2.84-1.16 3.24-2.28.4-1.12.4-2.08.28-2.28-.12-.2-.44-.32-.92-.56z"
              />
            </svg>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
