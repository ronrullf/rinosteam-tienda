import Link from 'next/link'

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-4 px-4 text-center"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <span className="text-6xl">🎮</span>
      <h1
        className="font-display text-5xl"
        style={{ color: 'var(--text-primary)' }}
      >
        404
      </h1>
      <p
        className="font-sans text-[16px]"
        style={{ color: 'var(--text-secondary)' }}
      >
        Esta página no existe
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-3 rounded-lg font-sans font-semibold text-white"
        style={{ backgroundColor: 'var(--orange-500)' }}
      >
        ← Volver a la tienda
      </Link>
    </div>
  )
}
