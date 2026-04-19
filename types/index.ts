export type Category =
  | 'Acción'
  | 'Aventura'
  | 'RPG'
  | 'Terror'
  | 'Deportes'
  | 'Simulación'
  | 'FPS'
  | 'Estrategia'

export const CATEGORIES: Category[] = [
  'Acción',
  'Aventura',
  'RPG',
  'Terror',
  'Deportes',
  'Simulación',
  'FPS',
  'Estrategia',
]

export interface Game {
  id: string
  title: string
  slug: string
  description: string | null
  original_price: number
  sale_price: number
  discount_pct: number | null
  image_url: string
  category: Category
  is_active: boolean
  is_featured: boolean
  stock_note: string | null
  created_at: string
  updated_at: string
}

export type Country = 'Chile' | 'Venezuela'

export interface CartItem {
  game: Game
  discounted: boolean   // 20% off via upsell
}

export interface DiscountCode {
  id: string
  code: string
  discount_pct: number
  duration_days: number
  expires_at: string
  is_active: boolean
  created_at: string
}

export interface GameFormData {
  title: string
  description: string
  original_price: string
  sale_price: string
  category: Category
  is_featured: boolean
  is_active: boolean
  stock_note: string
  image_url: string
}
