'use client'

import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import { useStore } from '@/context/StoreContext'
import { formatPrice, formatPriceCLP, buildCartWhatsAppUrl } from '@/lib/utils'

function priceOf(amount: number, country: 'CL' | 'VE' | null) {
  return country === 'CL' ? formatPriceCLP(amount) : formatPrice(amount)
}

export function CartDrawer() {
  const {
    isCartOpen, setCartOpen,
    cartItems, removeFromCart, clearCart, addToCart,
    gamesList, country, buyerName,
    setTermsOpen,
  } = useStore()

  // Compute per-item final price (20% off if discounted)
  const itemsWithPrice = cartItems.map(item => {
    const base = item.game.sale_price
    const final = item.discounted ? base * 0.8 : base
    return { ...item, finalPrice: final }
  })

  const subtotal = itemsWithPrice.reduce((s, i) => s + i.finalPrice, 0)
  const steamTotal = cartItems.reduce((s, i) => s + i.game.original_price, 0)
  const savings = steamTotal - subtotal
  const subtotalDisplay = priceOf(subtotal, country)
  const steamDisplay = priceOf(steamTotal, country)
  const savingsDisplay = priceOf(savings, country)

  // Games not yet in cart (for upsell)
  const cartIds = new Set(cartItems.map(i => i.game.id))
  const upsellGames = gamesList.filter(g => !cartIds.has(g.id)).slice(0, 3)

  function handleCheckout() {
    if (cartItems.length === 0) return
    const items = itemsWithPrice.map(i => ({
      title: i.game.title,
      priceDisplay: priceOf(i.finalPrice, country),
    }))
    const url = buildCartWhatsAppUrl(items, subtotalDisplay, buyerName)
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-50"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 flex flex-col"
            style={{ width: 'min(380px, 100vw)', backgroundColor: 'var(--bg-surface)', borderLeft: '1px solid var(--border)' }}
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-4 border-b flex-shrink-0"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-elevated)' }}>
              <div className="flex items-center gap-2">
                <span className="text-xl">🛒</span>
                <h2 className="font-heading text-xl" style={{ color: 'var(--text-primary)' }}>
                  Mi Carrito
                </h2>
                {cartItems.length > 0 && (
                  <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                    style={{ backgroundColor: 'var(--orange-500)', color: '#fff' }}>
                    {cartItems.length}
                  </span>
                )}
              </div>
              <button onClick={() => setCartOpen(false)} className="text-2xl" style={{ color: 'var(--text-muted)' }}>✕</button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">

              {cartItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center flex-1 gap-3 py-16">
                  <span className="text-5xl">🛒</span>
                  <p className="font-sans text-[14px]" style={{ color: 'var(--text-muted)' }}>Tu carrito está vacío</p>
                </div>
              ) : (
                <>
                  {/* Items */}
                  <div className="flex flex-col gap-3">
                    {itemsWithPrice.map((item) => (
                      <div key={item.game.id}
                        className="flex gap-3 rounded-xl border p-3"
                        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                        <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.game.image_url} alt={item.game.title} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-heading text-base leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                            {item.game.title}
                          </p>
                          {item.discounted && (
                            <span className="font-sans text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#22C55E' }}>
                              -20% DESCUENTO
                            </span>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="font-sans text-[11px] line-through" style={{ color: 'var(--text-muted)' }}>
                              {priceOf(item.game.sale_price, country)}
                            </span>
                            <span className="font-heading text-lg" style={{ color: 'var(--gold)' }}>
                              {priceOf(item.finalPrice, country)}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => removeFromCart(item.game.id)}
                          className="text-lg flex-shrink-0 self-start" style={{ color: 'var(--text-muted)' }}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Savings vs Steam */}
                  <div className="rounded-xl p-3 border"
                    style={{ backgroundColor: 'rgba(34,197,94,0.05)', borderColor: 'rgba(34,197,94,0.25)' }}>
                    <div className="flex justify-between font-sans text-[13px]">
                      <span style={{ color: 'var(--text-secondary)' }}>Precio en Steam:</span>
                      <span className="line-through" style={{ color: 'var(--text-muted)' }}>{steamDisplay}</span>
                    </div>
                    <div className="flex justify-between font-sans text-[13px] mt-1">
                      <span style={{ color: 'var(--text-secondary)' }}>Subtotal:</span>
                      <span style={{ color: 'var(--text-primary)' }}>{subtotalDisplay}</span>
                    </div>
                    <div className="flex justify-between font-heading text-base mt-1.5 pt-1.5 border-t"
                      style={{ borderColor: 'rgba(34,197,94,0.2)' }}>
                      <span style={{ color: '#22C55E' }}>🎉 Ahorras:</span>
                      <span style={{ color: '#22C55E' }}>{savingsDisplay}</span>
                    </div>
                    <div className="flex justify-between font-heading text-xl mt-1">
                      <span style={{ color: 'var(--text-primary)' }}>Total:</span>
                      <span style={{ color: 'var(--gold)' }}>{subtotalDisplay}</span>
                    </div>
                  </div>

                  {/* Disclaimer 2+ games */}
                  {cartItems.length >= 2 && (
                    <div className="rounded-xl p-3 border"
                      style={{ backgroundColor: 'rgba(249,115,22,0.06)', borderColor: 'var(--border-strong)' }}>
                      <p className="font-sans text-[12px]" style={{ color: 'var(--orange-400)' }}>
                        ⚠️ Al comprar más de 2 juegos, solo puedes probar un máximo de 2 juegos antes de realizar el pago y recibir los títulos restantes.
                      </p>
                    </div>
                  )}

                  {/* Upsell */}
                  {upsellGames.length > 0 && (
                    <div className="rounded-xl border overflow-hidden"
                      style={{ borderColor: 'var(--border-strong)', backgroundColor: 'var(--bg-elevated)' }}>
                      <div className="px-3 pt-3 pb-2"
                        style={{ background: 'linear-gradient(135deg, rgba(249,115,22,0.15), rgba(249,115,22,0.05))' }}>
                        <p className="font-heading text-base" style={{ color: 'var(--orange-400)' }}>
                          🔥 Añade este y llévalo un 20% más barato
                        </p>
                        <p className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
                          Descuento exclusivo al comprar junto con otro juego
                        </p>
                      </div>
                      <div className="flex flex-col gap-0 divide-y" style={{ borderColor: 'var(--border)' }}>
                        {upsellGames.map(g => {
                          const discountedPrice = g.sale_price * 0.8
                          return (
                            <div key={g.id} className="flex items-center gap-3 p-3">
                              <div className="relative w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                                <Image src={g.image_url} alt={g.title} fill className="object-cover" sizes="48px" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-heading text-sm leading-tight truncate" style={{ color: 'var(--text-primary)' }}>
                                  {g.title}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="font-sans text-[11px] line-through" style={{ color: 'var(--text-muted)' }}>
                                    {priceOf(g.sale_price, country)}
                                  </span>
                                  <span className="font-heading text-base" style={{ color: '#22C55E' }}>
                                    {priceOf(discountedPrice, country)}
                                  </span>
                                  <span className="font-sans text-[10px] px-1 rounded font-bold"
                                    style={{ backgroundColor: 'rgba(34,197,94,0.2)', color: '#22C55E' }}>
                                    -20%
                                  </span>
                                </div>
                              </div>
                              <button onClick={() => addToCart(g, true)}
                                className="flex-shrink-0 px-3 py-1.5 rounded-lg font-heading text-sm transition-all active:scale-95"
                                style={{ backgroundColor: 'var(--orange-500)', color: '#fff' }}>
                                + Añadir
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="flex-shrink-0 border-t p-4 flex flex-col gap-3"
                style={{ borderColor: 'var(--border)', backgroundColor: 'var(--bg-surface)' }}>
                <div className="flex justify-between items-center">
                  <span className="font-heading text-lg" style={{ color: 'var(--text-secondary)' }}>Total:</span>
                  <span className="font-display text-2xl" style={{ color: 'var(--gold)' }}>{subtotalDisplay}</span>
                </div>
                <button onClick={handleCheckout}
                  className="w-full font-heading text-lg py-3.5 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#25D366', color: '#fff' }}>
                  <svg width="20" height="20" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16.002 3C9.374 3 4 8.373 4 15c0 2.388.67 4.617 1.832 6.514L4 29l7.697-1.812A12.93 12.93 0 0016.002 28C22.629 28 28 22.627 28 16S22.629 3 16.002 3zm0 23.5c-2.09 0-4.045-.578-5.72-1.578l-.41-.244-4.573 1.076 1.098-4.445-.267-.432A10.47 10.47 0 015.5 15c0-5.79 4.71-10.5 10.502-10.5C21.793 4.5 26.5 9.21 26.5 15s-4.707 10.5-10.498 10.5zM21.877 18.15c-.304-.152-1.8-.887-2.08-.988-.278-.101-.48-.152-.682.152s-.783.988-.96 1.191c-.176.202-.353.228-.656.076-.303-.152-1.28-.472-2.438-1.504-.9-.803-1.508-1.796-1.685-2.1-.176-.303-.019-.467.133-.618.136-.135.303-.353.455-.53.152-.176.202-.303.303-.505.102-.203.051-.38-.025-.53-.076-.153-.682-1.644-.934-2.25-.247-.59-.498-.51-.682-.52l-.58-.01c-.202 0-.53.076-.808.38s-1.061 1.036-1.061 2.527 1.086 2.93 1.237 3.132c.152.202 2.136 3.26 5.178 4.572.724.312 1.288.499 1.728.638.726.23 1.388.198 1.91.12.582-.087 1.8-.735 2.055-1.444.253-.709.253-1.317.177-1.444-.076-.126-.277-.202-.58-.354z" />
                  </svg>
                  PEDIR POR WHATSAPP
                </button>
                <button onClick={() => { clearCart(); setCartOpen(false) }}
                  className="font-sans text-[12px] text-center" style={{ color: 'var(--text-muted)' }}>
                  Vaciar carrito
                </button>
                <p className="font-sans text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>
                  Al continuar aceptas nuestros{' '}
                  <button onClick={() => setTermsOpen(true)} className="underline" style={{ color: 'var(--orange-400)' }}>
                    Términos y Condiciones
                  </button>
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
