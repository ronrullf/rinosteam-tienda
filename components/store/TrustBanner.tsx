const items = [
  { icon: '✅', label: 'Acceso primero', desc: 'Juegas antes de pagar' },
  { icon: '⚡', label: 'Entrega rápida', desc: 'Por WhatsApp en minutos' },
  { icon: '🛡', label: 'Sin riesgo', desc: 'Garantía anti-estafa' },
]

export function TrustBanner() {
  return (
    <div
      className="border-y"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 divide-x divide-[--border]">
          {items.map(({ icon, label, desc }) => (
            <div
              key={label}
              className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-3 py-3 sm:py-4 px-2 sm:px-4"
            >
              <span className="text-xl sm:text-2xl leading-none flex-shrink-0" role="img" aria-label={label}>
                {icon}
              </span>
              <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <span
                  className="font-sans text-[11px] sm:text-[13px] font-semibold uppercase tracking-wide"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {label}
                </span>
                <span
                  className="hidden sm:block font-sans text-[12px]"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {desc}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
