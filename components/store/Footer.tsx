export function Footer() {
  return (
    <footer
      className="border-t safe-bottom"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Layout: columna en mobile, fila en desktop */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

          {/* Logo + tagline */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="font-display text-2xl md:text-3xl" style={{ color: 'var(--text-primary)' }}>
              🦏 RINO<span style={{ color: 'var(--orange-500)' }}>STEAM</span>
            </span>
            <p className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
              Solo para PC vía Steam
            </p>
          </div>

          {/* Trust badges — desktop */}
          <div className="hidden md:flex items-center gap-6">
            {[
              { icon: '✅', text: 'Acceso primero' },
              { icon: '⚡', text: 'Entrega rápida' },
              { icon: '🛡', text: 'Sin riesgo' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5">
                <span>{icon}</span>
                <span className="font-sans text-[13px]" style={{ color: 'var(--text-secondary)' }}>
                  {text}
                </span>
              </div>
            ))}
          </div>

          {/* Países + copyright */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xl">🇨🇱</span>
              <span className="text-xl">🇻🇪</span>
              <span className="font-sans text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                Chile · Venezuela
              </span>
            </div>
            <p className="font-sans text-[12px]" style={{ color: 'var(--text-muted)' }}>
              © {new Date().getFullYear()} RinoSteam
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
