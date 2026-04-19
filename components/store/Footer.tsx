export function Footer() {
  return (
    <footer
      className="flex flex-col items-center justify-center gap-1 py-8 px-4 text-center border-t safe-bottom"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'var(--bg-surface)',
      }}
    >
      <span
        className="font-display text-2xl"
        style={{ color: 'var(--text-primary)' }}
      >
        🦏 RINO<span style={{ color: 'var(--orange-500)' }}>STEAM</span>
      </span>
      <p
        className="font-sans text-[13px]"
        style={{ color: 'var(--text-secondary)' }}
      >
        Solo para PC vía Steam
      </p>
      <p
        className="font-sans text-[12px] mt-1"
        style={{ color: 'var(--text-muted)' }}
      >
        © {new Date().getFullYear()} RinoSteam
      </p>
    </footer>
  )
}
