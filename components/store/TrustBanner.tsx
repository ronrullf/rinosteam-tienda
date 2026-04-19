const items = [
  { icon: '✅', label: 'Acceso primero' },
  { icon: '⚡', label: 'Entrega rápida' },
  { icon: '🛡', label: 'Sin riesgo' },
]

export function TrustBanner() {
  return (
    <div
      className="grid grid-cols-3 border-y"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        borderColor: 'var(--border)',
      }}
    >
      {items.map(({ icon, label }) => (
        <div
          key={label}
          className="flex flex-col items-center justify-center gap-1 py-3 px-1"
        >
          <span className="text-xl leading-none" role="img" aria-label={label}>
            {icon}
          </span>
          <span
            className="font-sans text-[11px] font-semibold text-center uppercase tracking-wide"
            style={{ color: 'var(--text-secondary)' }}
          >
            {label}
          </span>
        </div>
      ))}
    </div>
  )
}
