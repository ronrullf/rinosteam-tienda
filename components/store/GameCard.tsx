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
      className={`game-card rounded-card overflow-hidden border flex flex-col h-full${featured ? ' md:col-span-2' : ''}`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.5), duration: 0.35 }}
      layout
    >
      {/* Imagen */}
      <div
        className="relative w-full overflow-hidden flex-shrink-0"
        style={{ aspectRatio: featured ? '16/9' : '3/4' }}
      >
        <Image
          src={game.image_url}
          alt={game.title}
          fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={index < 6}
        />

        {/* Gradiente inferior */}
        <div
          className="absolute inset-x-0 bottom-0 h-1/2"
          style={{
            background: 'linear-gradient(to top, var(--bg-surface), transparent)',
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

        {/* Stock note */}
        {game.stock_note && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="stock" className="text-[10px]">
              ⚠️ {game.stock_note}
            </Badge>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1.5 p-3 md:p-4 flex-1">
        <h3
          className="font-heading leading-tight line-clamp-2"
          style={{
            fontSize: 'clamp(16px, 2vw, 20px)',
            color: 'var(--text-primary)',
          }}
        >
          {game.title}
        </h3>

        {/* Categoría */}
        <span
          className="font-sans text-[11px] uppercase tracking-wide"
          style={{ color: 'var(--text-muted)' }}
        >
          {game.category}
        </span>

        {/* Estrellas */}
        <div className="flex gap-0.5" aria-hidden>
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-sm" style={{ color: 'var(--gold-light)' }}>
              ★
            </span>
          ))}
        </div>

        {/* Precios */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <span className="price-original">{formatPrice(game.original_price)}</span>
          <span
            className="font-display"
            style={{
              fontSize: 'clamp(22px, 3vw, 28px)',
              color: 'var(--gold)',
              lineHeight: 1,
            }}
          >
            {formatPrice(game.sale_price)}
          </span>
        </div>

        {/* CTA */}
        <Button
          variant="primary"
          fullWidth
          pulse
          onClick={handleBuy}
          className="mt-2 font-heading tracking-wide uppercase"
          style={{ fontSize: 'clamp(12px, 1.5vw, 14px)', letterSpacing: '0.05em' }}
        >
          COMPRAR AHORA →
        </Button>
      </div>
    </motion.article>
  )
}
