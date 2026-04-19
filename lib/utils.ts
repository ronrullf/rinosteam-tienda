import type { Country } from '@/types'

/** Construye URL de WhatsApp — compra de un solo juego */
export function buildWhatsAppUrl(
  gameTitle: string,
  country: Country,
  buyerName?: string,
  priceDisplay?: string
): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '584262031630'
  const name = buyerName?.trim() || 'Cliente'
  const price = priceDisplay ?? ''
  const message = encodeURIComponent(
    `¡Hola Rino! Quiero el: ${gameTitle}\nPrecio: ${price}\n\nYa leí el procedimiento de compra, acepté los términos y condiciones y estoy de acuerdo. ¿Podemos empezar la prueba ahora mismo?\n\n— ${name}`
  )
  return `https://wa.me/${number}?text=${message}`
}

/** Construye URL de WhatsApp — compra desde el carrito */
export function buildCartWhatsAppUrl(
  items: { title: string; priceDisplay: string }[],
  totalDisplay: string,
  buyerName?: string
): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '584262031630'
  const name = buyerName?.trim() || 'Cliente'
  const gameList = items.map(i => `• ${i.title} — ${i.priceDisplay}`).join('\n')
  const message = encodeURIComponent(
    `¡Hola Rino! Quiero:\n${gameList}\n\nTotal: ${totalDisplay}\n\nHe leído el proceso de compra, los términos y condiciones y estoy de acuerdo. ¿Podemos empezar ahora mismo?\n\n— ${name}`
  )
  return `https://wa.me/${number}?text=${message}`
}

/** Genera slug limpio desde un título */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 80)
}

/** Formatea precio en USD */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

/** Convierte USD a CLP — fórmula: ceil(usd*900/100)*100 - 1  → termina en 99 */
export function formatPriceCLP(usdPrice: number): string {
  const clp = Math.ceil((usdPrice * 900) / 100) * 100 - 1
  return `$${clp.toLocaleString('es-CL')} CLP`
}

/** Convierte USD a Bolívares usando tasa paralelo + 50 Bs de margen */
export function formatPriceBS(usdPrice: number, rate: number): string {
  const bs = usdPrice * rate
  return `${bs.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Bs`
}

/** Devuelve precio formateado según país seleccionado */
export function formatPriceByCountry(
  usdPrice: number,
  country: 'CL' | 'VE' | null,
  bsRate?: number | null
): string {
  if (country === 'CL') return formatPriceCLP(usdPrice)
  if (country === 'VE' && bsRate) return formatPriceBS(usdPrice, bsRate)
  return formatPrice(usdPrice)
}

/**
 * Precio completo para mensaje WA:
 * VE → "$4.99 (3,345.84 Bs)"
 * CL → "$4.99 ($4,499 CLP)"
 */
export function formatPriceFull(
  usdPrice: number,
  country: 'CL' | 'VE' | null,
  bsRate?: number | null
): string {
  const usd = formatPrice(usdPrice)
  if (country === 'CL') return `${usd} (${formatPriceCLP(usdPrice)})`
  if (country === 'VE' && bsRate) return `${usd} (${formatPriceBS(usdPrice, bsRate)})`
  return usd
}

/** Calcula porcentaje de descuento */
export function calcDiscount(original: number, sale: number): number {
  if (original <= 0) return 0
  return Math.round((1 - sale / original) * 100)
}

/** Clases condicionales */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
