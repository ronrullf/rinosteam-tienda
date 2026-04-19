import type { Country } from '@/types'

/** Construye la URL de WhatsApp con mensaje pre-escrito */
export function buildWhatsAppUrl(gameTitle: string, country: Country): string {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  const message = encodeURIComponent(
    `Hola quiero comprar ${gameTitle} soy de ${country}`
  )
  return `https://wa.me/${number}?text=${message}`
}

/** Genera slug limpio desde un título */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .slice(0, 80)
}

/** Formatea precio en USD */
export function formatPrice(price: number): string {
  return `$${price.toFixed(2)}`
}

/** Calcula porcentaje de descuento */
export function calcDiscount(original: number, sale: number): number {
  if (original <= 0) return 0
  return Math.round((1 - sale / original) * 100)
}

/** Clases condicionales (cn helper simple) */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}
