import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import type { DiscountCodeData } from '@/lib/redis'

/** POST /api/discount-codes/validate — valida un código de descuento */
export async function POST(req: Request) {
  const { code } = await req.json()

  if (!code) {
    return NextResponse.json({ valid: false, message: 'Código inválido' })
  }

  const trimmed = String(code).trim().toUpperCase()
  const key = `discount:${trimmed}`

  const data = await redis.hgetall<DiscountCodeData>(key)

  if (!data) {
    return NextResponse.json({ valid: false, message: 'Código inválido o no existe' })
  }

  const isExpiredByTime   = new Date(data.expires_at) < new Date()
  const isExpiredByStatus = data.status === 'expired'

  if (isExpiredByTime || isExpiredByStatus) {
    if (isExpiredByTime && !isExpiredByStatus) {
      await redis.hset(key, { status: 'expired' })
    }
    return NextResponse.json({ valid: false, message: 'Este código ha expirado' })
  }

  return NextResponse.json({ valid: true, discount_pct: Number(data.discount_pct) })
}
