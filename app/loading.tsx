import { HeroSection } from '@/components/store/HeroSection'
import { TrustBanner } from '@/components/store/TrustBanner'
import { GameGridSkeleton } from '@/components/store/GameGridSkeleton'

/**
 * loading.tsx — se muestra durante la navegación hacia la home.
 * Muestra Hero + TrustBanner inmediatamente y skeleton del grid.
 */
export default function Loading() {
  return (
    <div style={{ backgroundColor: 'var(--bg-base)' }}>
      <HeroSection />
      <TrustBanner />

      {/* Skeleton del CategoryFilter */}
      <div
        className="sticky top-14 md:top-16 z-30 border-b"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 md:py-3 flex gap-2 overflow-hidden">
          {['Todos', 'Acción', 'Terror', 'RPG', 'FPS', 'Aventura'].map((l) => (
            <div
              key={l}
              className="skeleton-shimmer rounded-full flex-shrink-0"
              style={{ width: `${l.length * 9 + 24}px`, height: '32px' }}
            />
          ))}
        </div>
      </div>

      {/* Skeleton del grid de juegos */}
      <GameGridSkeleton count={10} />
    </div>
  )
}
