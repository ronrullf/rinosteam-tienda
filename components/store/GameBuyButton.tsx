'use client'

import { useStore } from '@/context/StoreContext'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'
import type { Game } from '@/types'

interface GameBuyButtonProps {
  game: Game
}

export function GameBuyButton({ game }: GameBuyButtonProps) {
  const { setSelectedGame, setCountryModalOpen } = useStore()

  function handleBuy() {
    setSelectedGame(game)
    setCountryModalOpen(true)
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
      COMPRAR POR {formatPrice(game.sale_price)} →
    </Button>
  )
}
