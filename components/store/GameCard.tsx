'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Game } from '@/types'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/context/StoreContext'

interface GameCardProps {
  game: Game
  index: number
  featured?: boolean
}

export function GameCard({ game, index, featured = false }: GameCardProps) {
  const { setSelectedGame, setCountryModalOpen } = useStore()

  const discount = game.discount_pct ?? 0

  function handleBuy() {
    setSelectedGame(game)
    setCountryModalOpen(true)
  }

  return (
    <motion.article
      className="game-card rounded-card overflow-hidden border flex flex-col"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
        gridColumn: featured ? 'span 2' : undefined,
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.35 }}
      layout
    >
      {/* Imagen */}
      <div
        className="relative w-full overflow-hidden"
        style={{ aspectRatio: featured ? '16/9' : '3/4' }}
      >
        <Image
          src={game.image_url}
          alt={game.title}
          fill
          className="object-cover"
          sizes={
            featured
              ? '(max-width: 430px) 100vw, 430px'
              : '(max-width: 430px) 50vw, 200px'
          }
          priority={index < 4}
        />

        {/* Gradiente inferior */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              'linear-gradient(to top, var(--bg-surface), transparent)',
          }}
        />

        {/* Badges overlay */}
        <div className="absolute top-2 inset-x-2 flex justify-between items-start">
          {discount > 0 && (
            <Badge variant="discount" shine className="shadow-lg">
              -{discount}%
            </Badge>
          )}
          {game.is_featured && (
            <Badge variant="hot" className="shadow-lg ml-auto">
              🔥 HOT
            </Badge>
          )}
        </div>

        {/* Stock urgency */}
        {game.stock_note && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="stock" className="text-[10px]">
              ⚠️ {game.stock_note}
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3 flex-1">
        <h3
          className="font-heading leading-tight"
          style={{
            fontSize: featured ? '22px' : '18px',
            color: 'var(--text-primary)',
          }}
        >
          {game.title}
        </h3>

        {/* Estrellas decorativas */}
        <div className="flex gap-0.5" aria-label="5 estrellas">
          {[...Array(5)].map((_, i) => (
            <span
              key={i}
              className="text-[13px]"
              style={{ color: 'var(--gold-light)' }}
            >
              ★
            </span>
          ))}
        </div>

        {/* Precios */}
        <div className="flex items-baseline gap-2">
          <span className="price-original">{formatPrice(game.original_price)}</span>
          <span
            className="font-display"
            style={{
              fontSize: '26px',
              color: 'var(--gold)',
              lineHeight: 1,
            }}
          >
            {formatPrice(game.sale_price)}
          </span>
        </div>

        {/* Botón CTA */}
        <Button
          variant="primary"
          fullWidth
          pulse
          onClick={handleBuy}
          className="mt-auto text-[14px] font-heading tracking-wide uppercase"
          style={{ letterSpacing: '0.05em' }}
        >
          COMPRAR AHORA →
        </Button>
      </div>
    </motion.article>
  )
}
