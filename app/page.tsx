import { Suspense } from 'react'
import { Header } from '@/components/store/Header'
import { HeroSection } from '@/components/store/HeroSection'
import { TrustBanner } from '@/components/store/TrustBanner'
import { CategoryFilter } from '@/components/store/CategoryFilter'
import { GameGridServer } from '@/components/store/GameGridServer'
import { GameGridSkeleton } from '@/components/store/GameGridSkeleton'
import { CountryModal } from '@/components/store/CountryModal'
import { WhatsAppFAB } from '@/components/store/WhatsAppFAB'
import { Footer } from '@/components/store/Footer'

// Force dynamic para Supabase SSR cookies
export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* Hero y trust banner se renderizan inmediatamente */}
        <HeroSection />
        <TrustBanner />

        {/* CategoryFilter necesita client state — viene del GameGridContainer */}
        {/* El Suspense muestra el skeleton mientras los juegos cargan del servidor */}
        <Suspense
          fallback={
            <>
              {/* Skeleton del CategoryFilter */}
              <div
                className="sticky top-14 md:top-16 z-30 border-b"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  borderColor: 'var(--border)',
                }}
              >
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 md:py-3 flex gap-2">
                  {['Todos', 'Acción', 'Terror', 'RPG', 'FPS'].map((l) => (
                    <div
                      key={l}
                      className="skeleton-shimmer rounded-full flex-shrink-0"
                      style={{ width: `${l.length * 9 + 24}px`, height: '32px' }}
                    />
                  ))}
                </div>
              </div>

              {/* Skeleton del grid */}
              <GameGridSkeleton count={10} />
            </>
          }
        >
          <GameGridServer />
        </Suspense>
      </main>

      <Footer />
      <CountryModal />
      <WhatsAppFAB />
    </>
  )
}
