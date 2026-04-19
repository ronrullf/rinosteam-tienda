import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice } from '@/lib/utils'
import { CountryModal } from '@/components/store/CountryModal'
import { Header } from '@/components/store/Header'
import { GameBuyButton } from '@/components/store/GameBuyButton'
import type { Game } from '@/types'

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
      <main>
        {/* Imagen hero */}
        <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
          <Image
            src={game.image_url}
            alt={game.title}
            fill
            className="object-cover"
            sizes="430px"
            priority
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, var(--bg-base) 0%, transparent 60%)',
            }}
          />
          {discount > 0 && (
            <span
              className="absolute top-3 left-3 font-sans font-bold text-white text-sm px-2 py-1 rounded-lg animate-shine"
            >
              -{discount}% MÁS BARATO
            </span>
          )}
        </div>

        <div className="px-4 pt-4 pb-24 flex flex-col gap-4">
          {/* Título */}
          <h1
            className="font-heading text-4xl leading-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            {game.title}
          </h1>

          {/* Estrellas */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-lg" style={{ color: 'var(--gold-light)' }}>
                ★
              </span>
            ))}
          </div>

          {/* Precios */}
          <div className="flex items-baseline gap-3">
            <span className="price-original text-base">
              {formatPrice(game.original_price)}
            </span>
            <span
              className="font-display text-5xl"
              style={{ color: 'var(--gold)', lineHeight: 1 }}
            >
              {formatPrice(game.sale_price)}
            </span>
          </div>

          {/* Descripción */}
          {game.description && (
            <p
              className="font-sans text-[15px] leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              {game.description}
            </p>
          )}

          {/* Trust bullets */}
          <div
            className="rounded-xl border p-4 flex flex-col gap-2 mt-2"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--border)',
            }}
          >
            <p
              className="font-heading text-lg mb-1"
              style={{ color: 'var(--orange-400)' }}
            >
              ¿Por qué RinoSteam?
            </p>
            {[
              '✅ Accedes primero, pagas después',
              '⚡ Entrega en minutos por WhatsApp',
              '🛡 Sin riesgo de estafa garantizado',
            ].map((item) => (
              <p
                key={item}
                className="font-sans text-[14px]"
                style={{ color: 'var(--text-secondary)' }}
              >
                {item}
              </p>
            ))}
          </div>
        </div>

        {/* CTA sticky bottom */}
        <div
          className="fixed bottom-0 inset-x-0 z-30 px-4 py-3 border-t safe-bottom mx-auto"
          style={{
            maxWidth: '430px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(13,7,3,0.95)',
            backdropFilter: 'blur(8px)',
            borderColor: 'var(--border)',
          }}
        >
          <GameBuyButton game={game} />
        </div>
      </main>

      <CountryModal />
    </>
  )
}
