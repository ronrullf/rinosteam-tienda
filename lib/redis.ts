import { Redis } from '@upstash/redis'

export const redis = Redis.fromEnv()

export interface DiscountCodeData extends Record<string, unknown> {
  id: string
  code: string
  discount_pct: number
  duration_hours: number
  expires_at: string
  status: 'valid' | 'expired'
  created_at: string
}
