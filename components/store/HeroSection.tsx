'use client'

import { motion } from 'framer-motion'

export function HeroSection() {
  return (
    <section
      className="relative overflow-hidden noise-overlay"
      style={{
        minHeight: '220px',
        background:
          'linear-gradient(135deg, #080402 0%, #1a0800 40%, #0d0400 70%, #080402 100%)',
      }}
    >
      {/* Partículas de fuego CSS */}
      <div aria-hidden className="absolute inset-0 pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${8 + i * 4}px`,
              height: `${8 + i * 4}px`,
              background: 'var(--orange-500)',
              left: `${10 + i * 15}%`,
              bottom: `${10 + (i % 3) * 20}%`,
              filter: 'blur(4px)',
              animation: `float-particle ${2 + i * 0.5}s ease-in-out infinite alternate`,
              animationDelay: `${i * 0.3}s`,
            }}
          />
        ))}
      </div>

      {/* Glow de fondo naranja */}
      <div
        aria-hidden
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-64 h-32 pointer-events-none"
        style={{
          background: 'var(--orange-glow)',
          filter: 'blur(40px)',
          borderRadius: '50%',
        }}
      />

      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-10 gap-3">
        {/* Badge superior */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-white text-[13px] font-sans font-semibold uppercase tracking-wider animate-shine"
            style={{ fontSize: '12px' }}
          >
            🔥 HASTA 90% MÁS BARATO
          </span>
        </motion.div>

        {/* Título principal */}
        <motion.h1
          className="font-display leading-none tracking-wide"
          style={{
            fontSize: 'clamp(44px, 12vw, 72px)',
            color: 'var(--text-primary)',
            textShadow: '0 0 40px rgba(249,115,22,0.3)',
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
          className="font-sans text-[15px] max-w-[280px]"
          style={{ color: 'var(--text-secondary)' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          Sin riesgo. Sin estafa.{' '}
          <span
            className="font-semibold"
            style={{ color: 'var(--orange-400)' }}
          >
            Como debería ser.
          </span>
        </motion.p>
      </div>

    </section>
  )
}
