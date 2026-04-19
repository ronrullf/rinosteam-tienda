import { Suspense } from 'react'
import { Header } from '@/components/store/Header'
import { HeroSection } from '@/components/store/HeroSection'
import { TrustBanner } from '@/components/store/TrustBanner'
import { GameGridServer } from '@/components/store/GameGridServer'
import { GameGridSkeleton } from '@/components/store/GameGridSkeleton'
import { BuyModal } from '@/components/store/BuyModal'
import { CountryPickerModal } from '@/components/store/CountryPickerModal'
import { TermsModal } from '@/components/store/TermsModal'
import { TestimonialsCarousel } from '@/components/store/TestimonialsCarousel'
import { FakePurchasePopup } from '@/components/store/FakePurchasePopup'
import { CountdownBanner } from '@/components/store/CountdownBanner'
import { WhatsAppFAB } from '@/components/store/WhatsAppFAB'
import { Footer } from '@/components/store/Footer'
import { CartDrawer } from '@/components/store/CartDrawer'

export const dynamic = 'force-dynamic'

export default function HomePage() {
  return (
    <>
      {/* Countdown bar — debajo del header */}
      <Header />
      <CountdownBanner />

      <main>
        <HeroSection />
        <TrustBanner />

        {/* Testimonials carousel */}
        <TestimonialsCarousel />

        {/* Game grid con skeleton */}
        <Suspense
          fallback={
            <>
              <div
                className="sticky top-14 md:top-16 z-30 border-b"
                style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
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
              <GameGridSkeleton count={10} />
            </>
          }
        >
          <GameGridServer />
        </Suspense>
      </main>

      <Footer />

      {/* Modals & overlays */}
      <CountryPickerModal />
      <BuyModal />
      <TermsModal />
      <CartDrawer />
      <WhatsAppFAB />
      <FakePurchasePopup />
    </>
  )
}
