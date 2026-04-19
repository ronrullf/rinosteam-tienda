import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { BuyModal } from '@/components/store/BuyModal'
import { TermsModal } from '@/components/store/TermsModal'
import { CountryPickerModal } from '@/components/store/CountryPickerModal'
import { Header } from '@/components/store/Header'
import { Footer } from '@/components/store/Footer'
import { GameBuyButton } from '@/components/store/GameBuyButton'
import { WhatsAppFAB } from '@/components/store/WhatsAppFAB'
import { CartDrawer } from '@/components/store/CartDrawer'
import type { Game } from '@/types'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: game } = await supabase
    .from('games')
    .select('title, description')
    .eq('slug', slug)
    .single()

  if (!game) return {}
  return {
    title: `${game.title} — RinoSteam`,
    description: game.description ?? undefined,
  }
}

export default async function GamePage({ params }: PageProps) {
  const { slug } = await params
  const supabase = await createClient()
  const { data: game } = await supabase
    .from('games')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single<Game>()

  if (!game) notFound()

  const discount = game.discount_pct ?? 0

  return (
    <>
      <Header />

      <main className="pb-28">
        {/* ── HERO + CONTENIDO: layout en fila en desktop ── */}
        <div className="max-w-5xl mx-auto px-0 md:px-6 lg:px-8 md:py-8">
          <div className="md:grid md:grid-cols-2 md:gap-10 lg:gap-16 md:items-start">

            {/* Imagen */}
            <div className="relative w-full md:rounded-2xl md:overflow-hidden sticky md:top-24">
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                <Image
                  src={game.image_url}
                  alt={game.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
                {/* Gradiente solo en mobile */}
                <div
                  className="absolute inset-0 md:hidden"
                  style={{ background: 'linear-gradient(to top, var(--bg-base) 0%, transparent 60%)' }}
                />
                {discount > 0 && (
                  <span className="absolute top-3 left-3 animate-shine font-sans font-bold text-white text-sm px-3 py-1.5 rounded-lg">
                    -{discount}% MÁS BARATO
                  </span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="px-4 md:px-0 pt-4 md:pt-0 flex flex-col gap-5">

              {/* Categoría */}
              <span
                className="font-sans text-[12px] uppercase tracking-widest font-semibold"
                style={{ color: 'var(--orange-400)' }}
              >
                {game.category}
              </span>

              {/* Título */}
              <h1
                className="font-heading leading-tight"
                style={{
                  fontSize: 'clamp(28px, 5vw, 48px)',
                  color: 'var(--text-primary)',
                }}
              >
                {game.title}
              </h1>

              {/* Estrellas */}
              <div className="flex gap-1" aria-label="5 estrellas">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl" style={{ color: 'var(--gold-light)' }}>★</span>
                ))}
              </div>

              {/* Precios */}
              <div className="flex items-baseline gap-3">
                <span className="price-original text-base">{formatPrice(game.original_price)}</span>
                <span
                  className="font-display"
                  style={{ fontSize: 'clamp(36px, 6vw, 56px)', color: 'var(--gold)', lineHeight: 1 }}
                >
                  {formatPrice(game.sale_price)}
                </span>
              </div>

              {/* Descripción */}
              {game.description && (
                <p
                  className="font-sans text-[15px] md:text-base leading-relaxed"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {game.description}
                </p>
              )}

              {/* Trust bullets */}
              <div
                className="rounded-xl border p-4 flex flex-col gap-2"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}
              >
                <p className="font-heading text-lg" style={{ color: 'var(--orange-400)' }}>
                  ¿Por qué RinoSteam?
                </p>
                {[
                  '✅ Accedes primero, pagas después',
                  '⚡ Entrega en minutos por WhatsApp',
                  '🛡 Sin riesgo de estafa garantizado',
                ].map((item) => (
                  <p key={item} className="font-sans text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                    {item}
                  </p>
                ))}
              </div>

              {/* CTA — inline en desktop, sticky en mobile */}
              <div className="hidden md:block">
                <GameBuyButton game={game} />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* CTA sticky — solo mobile */}
      <div
        className="fixed bottom-0 inset-x-0 z-30 px-4 py-3 border-t safe-bottom md:hidden"
        style={{
          backgroundColor: 'rgba(13,7,3,0.95)',
          backdropFilter: 'blur(8px)',
          borderColor: 'var(--border)',
        }}
      >
        <GameBuyButton game={game} />
      </div>

      <Footer />
      <CountryPickerModal />
      <BuyModal />
      <TermsModal />
      <CartDrawer />
      <WhatsAppFAB />
    </>
  )
}
