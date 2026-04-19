'use client'

import { motion } from 'framer-motion'
import { useStore } from '@/context/StoreContext'

export function HeroSection() {
  const { setTermsOpen } = useStore()

  return (
    <section
      className="relative overflow-hidden noise-overlay"
      style={{
        minHeight: 'clamp(220px, 40vh, 480px)',
        background:
          'linear-gradient(135deg, #080402 0%, #1a0800 40%, #0d0400 70%, #080402 100%)',
      }}
    >
      {/* Partículas de fuego */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${8 + i * 5}px`,
              height: `${8 + i * 5}px`,
              background: 'var(--orange-500)',
              left: `${8 + i * 12}%`,
              bottom: `${10 + (i % 3) * 20}%`,
              filter: 'blur(5px)',
              animation: `float-particle ${2 + i * 0.4}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.25}s`,
            }}
          />
        ))}
      </div>

      {/* Glow central */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: 'clamp(200px, 50%, 600px)',
          height: '180px',
          background: 'var(--orange-glow)',
          filter: 'blur(60px)',
          borderRadius: '50%',
        }}
      />

      {/* Contenido */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-12 md:py-16 lg:py-20 gap-4 max-w-4xl mx-auto">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-white font-sans font-semibold uppercase tracking-wider animate-shine text-xs sm:text-sm">
            🔥 HASTA 90% MÁS BARATO
          </span>
        </motion.div>

        {/* Título */}
        <motion.h1
          className="font-display leading-none tracking-wide"
          style={{
            fontSize: 'clamp(44px, 8vw, 100px)',
            color: 'var(--text-primary)',
            textShadow: '0 0 60px rgba(249,115,22,0.3)',
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          JUGAR PRIMERO
          <br />
          <span style={{ color: 'var(--orange-500)' }}>PAGAR DESPUÉS</span>
        </motion.h1>

        {/* Subtítulo */}
        <motion.p
          className="font-sans text-base sm:text-lg md:text-xl max-w-md"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          Sin riesgo. Sin estafa.{' '}
          <span className="font-semibold" style={{ color: 'var(--orange-400)' }}>
            Como debería ser.
          </span>
        </motion.p>

        {/* Botón T&C debajo del Hero */}
        <motion.button
          onClick={() => setTermsOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-[12px] transition-all hover:opacity-80 active:scale-95"
          style={{
            backgroundColor: 'rgba(255,255,255,0.07)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.65)',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          📋 Términos y Condiciones (leer)
        </motion.button>
      </div>
    </section>
  )
}
