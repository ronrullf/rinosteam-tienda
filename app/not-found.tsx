import Link from 'next/link'
import { Header } from '@/components/store/Header'
import { Footer } from '@/components/store/Footer'

export default function NotFound() {
  return (
    <>
      <Header />
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center gap-5 px-4 text-center"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <span className="text-8xl">🎮</span>
        <div>
          <h1
            className="font-display text-7xl md:text-9xl"
            style={{ color: 'var(--orange-500)' }}
          >
            404
          </h1>
          <p
            className="font-heading text-2xl md:text-3xl mt-2"
            style={{ color: 'var(--text-primary)' }}
          >
            Página no encontrada
          </p>
          <p
            className="font-sans text-[15px] mt-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            El juego que buscas no existe o fue retirado.
          </p>
        </div>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading text-lg text-white uppercase tracking-wide"
          style={{ backgroundColor: 'var(--orange-500)' }}
        >
          ← Volver a la tienda
        </Link>
      </div>
      <Footer />
    </>
  )
}
