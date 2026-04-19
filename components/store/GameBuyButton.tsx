'use client'

import { useStore } from '@/context/StoreContext'
import { Button } from '@/components/ui/Button'
import { formatPrice, formatPriceCLP } from '@/lib/utils'
import type { Game } from '@/types'

interface GameBuyButtonProps {
  game: Game
}

export function GameBuyButton({ game }: GameBuyButtonProps) {
  const { setSelectedGame, setBuyModalOpen, country } = useStore()

  const priceDisplay = country === 'CL'
    ? formatPriceCLP(game.sale_price)
    : formatPrice(game.sale_price)

  function handleBuy() {
    setSelectedGame(game)
    setBuyModalOpen(true)
  }

  return (
    <Button
      variant="primary"
      fullWidth
      pulse
      size="lg"
      onClick={handleBuy}
      className="font-heading tracking-wide text-lg"
    >
      COMPRAR POR {priceDisplay} →
    </Button>
  )
}
