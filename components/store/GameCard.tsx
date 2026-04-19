'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { Game } from '@/types'
import { formatPrice, formatPriceCLP, formatPriceBS } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useStore } from '@/context/StoreContext'

interface GameCardProps {
  game: Game
  index: number
  featured?: boolean
}

/** Número pseudo-aleatorio estable basado en seed (game.id) */
function seedRandom(seed: string, min: number, max: number): number {
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = ((hash << 5) - hash) + seed.charCodeAt(i)
    hash |= 0
  }
  return min + (Math.abs(hash) % (max - min + 1))
}

export function GameCard({ game, index, featured = false }: GameCardProps) {
  const { setSelectedGame, setBuyModalOpen, addToCart, cartItems, country, bsRate } = useStore()

  const discount = game.discount_pct ?? 0
  const inCart = cartItems.some(i => i.game.id === game.id)

  // Precio local según país
  const saleDisplay = country === 'CL'
    ? formatPriceCLP(game.sale_price)
    : country === 'VE' && bsRate
      ? formatPriceBS(game.sale_price, bsRate)
      : formatPrice(game.sale_price)

  const origDisplay = country === 'CL'
    ? formatPriceCLP(game.original_price)
    : country === 'VE' && bsRate
      ? formatPriceBS(game.original_price, bsRate)
      : formatPrice(game.original_price)

  // Ahorro
  const savingsUSD = game.original_price - game.sale_price
  const savingsDisplay = country === 'CL'
    ? `$${Math.round(savingsUSD * 900).toLocaleString('es-CL')} CLP`
    : country === 'VE' && bsRate
      ? formatPriceBS(savingsUSD, bsRate)
      : `$${savingsUSD.toFixed(2)}`

  // FOMO estable por juego (seedeado del id)
  const viewers   = seedRandom(game.id, 2, 8)
  const stockLeft = seedRandom(game.id + '_stock', 3, 9)

  function handleBuy() {
    setSelectedGame(game)
    setBuyModalOpen(true)
  }

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation()
    addToCart(game, false)
  }

  return (
    <motion.article
      className={`game-card rounded-card overflow-hidden border flex flex-col h-full${featured ? ' md:col-span-2' : ''}`}
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.5), duration: 0.35 }}
      layout
    >
      {/* Image */}
      <div className="relative w-full overflow-hidden flex-shrink-0"
        style={{ aspectRatio: featured ? '16/9' : '3/4' }}>
        <Image src={game.image_url} alt={game.title} fill
          className="object-cover transition-transform duration-300 hover:scale-105"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          priority={index < 6} />
        <div className="absolute inset-x-0 bottom-0 h-1/2"
          style={{ background: 'linear-gradient(to top, var(--bg-surface), transparent)' }} />

        {/* Badges top */}
        <div className="absolute top-2 inset-x-2 flex justify-between items-start">
          {discount > 0 && <Badge variant="discount" shine className="shadow-lg">-{discount}%</Badge>}
          {game.is_featured && <Badge variant="hot" className="shadow-lg ml-auto">🔥 HOT</Badge>}
        </div>

        {/* FOMO badge — viewers + cuentas disponibles */}
        <div className="absolute bottom-2 left-2">
          <div className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-sans text-[10px] font-semibold"
            style={{ backgroundColor: 'rgba(0,0,0,0.78)', backdropFilter: 'blur(4px)', color: '#fff' }}>
            <span style={{ color: '#4ADE80' }}>👁 {viewers} viendo</span>
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>·</span>
            <span style={{ color: '#FBBF24' }}>📦 {stockLeft} cuentas</span>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-1 p-3 md:p-4 flex-1">
        <h3 className="font-heading leading-tight line-clamp-2"
          style={{ fontSize: 'clamp(15px, 2vw, 19px)', color: 'var(--text-primary)' }}>
          {game.title}
        </h3>
        <span className="font-sans text-[10px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {game.category}
        </span>
        <div className="flex gap-0.5" aria-hidden>
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-xs" style={{ color: 'var(--gold-light)' }}>★</span>
          ))}
        </div>

        {/* Anchor pricing */}
        <div className="rounded-lg px-2 py-2 mt-1" style={{ backgroundColor: 'var(--bg-elevated)' }}>
          <div className="flex items-center justify-between">
            <span className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>En Steam:</span>
            <span className="font-sans text-[12px] line-through" style={{ color: 'var(--text-muted)' }}>{origDisplay}</span>
          </div>
          <div className="flex items-center justify-between mt-1">
            <span className="font-sans text-[11px] font-bold" style={{ color: '#22C55E' }}>🎉 Ahorras:</span>
            <span className="font-heading text-[18px] font-bold" style={{ color: '#22C55E' }}>{savingsDisplay}</span>
          </div>
        </div>

        {/* Sale price — MÁS GRANDE */}
        <div className="flex items-baseline gap-2 mt-2">
          <span className="font-display" style={{ fontSize: 'clamp(28px, 4.5vw, 38px)', color: 'var(--gold)', lineHeight: 1 }}>
            {saleDisplay}
          </span>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-1.5 mt-auto pt-2">
          <Button variant="primary" fullWidth pulse onClick={handleBuy}
            className="font-heading tracking-wide uppercase"
            style={{ fontSize: 'clamp(11px, 1.5vw, 13px)', letterSpacing: '0.05em' }}>
            COMPRAR AHORA →
          </Button>
          <button onClick={handleAddToCart}
            className="w-full rounded-lg py-1.5 font-sans text-[12px] font-semibold transition-all active:scale-95 flex items-center justify-center gap-1"
            style={{
              backgroundColor: inCart ? 'rgba(34,197,94,0.15)' : 'var(--bg-elevated)',
              color: inCart ? '#22C55E' : 'var(--text-secondary)',
              border: `1px solid ${inCart ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
            }}>
            {inCart ? '✅ En el carrito' : '🛒 Añadir al carrito'}
          </button>
        </div>
      </div>
    </motion.article>
  )
}
