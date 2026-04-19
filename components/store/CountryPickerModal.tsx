'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore, CountryCode } from '@/context/StoreContext'

const PAYMENT_METHODS: Record<Exclude<CountryCode, null>, { icon: string; label: string; note?: string }[]> = {
  VE: [
    { icon: '📱', label: 'Pago Móvil' },
    { icon: '₿', label: 'Binance' },
    { icon: '💜', label: 'Zinli' },
    { icon: '🅿️', label: 'PayPal', note: '+40% del costo' },
  ],
  CL: [
    { icon: '🏦', label: 'Transferencia Bancaria' },
  ],
}

export function CountryPickerModal() {
  const { isCountryPickerOpen, setCountry } = useStore()
  const [hovering, setHovering] = useState<CountryCode>(null)

  return (
    <AnimatePresence>
      {isCountryPickerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[80]"
            style={{ backgroundColor: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(8px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
            <motion.div
              className="w-full max-w-md rounded-2xl border-2 overflow-hidden"
              style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--orange-500)' }}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="px-6 pt-6 pb-4 text-center">
                <div className="text-4xl mb-2">🦏</div>
                <h2 className="font-display text-3xl mb-1" style={{ color: 'var(--text-primary)' }}>
                  RINO<span style={{ color: 'var(--orange-500)' }}>STEAM</span>
                </h2>
                <p className="font-heading text-lg" style={{ color: 'var(--text-secondary)' }}>
                  ¿Desde dónde nos visitas?
                </p>
              </div>

              {/* Country buttons */}
              <div className="flex gap-4 px-6 pb-4">
                {([
                  { code: 'CL' as const, flag: '🇨🇱', label: 'Chile', sub: 'Precios en CLP' },
                  { code: 'VE' as const, flag: '🇻🇪', label: 'Venezuela', sub: 'Precios tasa Binance' },
                ] as const).map(({ code, flag, label, sub }) => (
                  <button
                    key={code}
                    onClick={() => setCountry(code)}
                    onMouseEnter={() => setHovering(code)}
                    onMouseLeave={() => setHovering(null)}
                    className="flex-1 flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 py-5 transition-all duration-150 active:scale-95"
                    style={{
                      borderColor: hovering === code ? 'var(--orange-500)' : 'var(--border)',
                      backgroundColor: hovering === code ? 'rgba(249,115,22,0.08)' : 'var(--bg-elevated)',
                    }}
                  >
                    <span className="text-5xl leading-none">{flag}</span>
                    <span className="font-heading text-xl" style={{ color: 'var(--text-primary)' }}>{label}</span>
                    <span className="font-sans text-[11px]" style={{ color: 'var(--orange-400)' }}>{sub}</span>
                  </button>
                ))}
              </div>

              {/* Payment methods preview */}
              <div
                className="mx-6 mb-6 rounded-xl border p-4"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
              >
                <p className="font-sans text-[12px] font-semibold mb-3 text-center uppercase tracking-wide"
                  style={{ color: 'var(--text-muted)' }}>
                  Métodos de pago disponibles
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {/* VE methods */}
                  <div>
                    <p className="font-sans text-[11px] mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      🇻🇪 Venezuela
                    </p>
                    {PAYMENT_METHODS.VE.map((m) => (
                      <div key={m.label} className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs">{m.icon}</span>
                        <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                        {m.note && <span className="font-sans text-[10px] px-1.5 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(249,115,22,0.15)', color: 'var(--orange-400)' }}>{m.note}</span>}
                      </div>
                    ))}
                  </div>
                  {/* CL methods */}
                  <div>
                    <p className="font-sans text-[11px] mb-1.5 flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                      🇨🇱 Chile
                    </p>
                    {PAYMENT_METHODS.CL.map((m) => (
                      <div key={m.label} className="flex items-center gap-1.5 mb-1">
                        <span className="text-xs">{m.icon}</span>
                        <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  )
}
