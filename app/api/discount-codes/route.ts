import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'
import type { DiscountCodeData } from '@/lib/redis'

/** GET /api/discount-codes — lista todos los códigos */
export async function GET() {
  const keys = await redis.smembers('discount_codes_index')

  if (!keys || keys.length === 0) return NextResponse.json([])

  const codes: DiscountCodeData[] = []
  for (const key of keys) {
    const data = await redis.hgetall<DiscountCodeData>(key)
    if (data) {
      // Auto-expirar si se pasó el tiempo
      if (data.status === 'valid' && new Date(data.expires_at) < new Date()) {
        await redis.hset(key, { status: 'expired' })
        data.status = 'expired'
      }
      codes.push(data)
    }
  }

  codes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
  return NextResponse.json(codes)
}

/** POST /api/discount-codes — crea un nuevo código */
export async function POST(req: Request) {
  const { code, discount_pct, duration_hours } = await req.json()

  if (!code || !discount_pct || !duration_hours) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const trimmed = String(code).trim().toUpperCase()
  const key = `discount:${trimmed}`

  // Verificar si ya existe
  const existing = await redis.exists(key)
  if (existing) {
    return NextResponse.json({ error: 'Ya existe un código con ese nombre' }, { status: 400 })
  }

  const expires_at = new Date()
  expires_at.setTime(expires_at.getTime() + Number(duration_hours) * 60 * 60 * 1000)

  const newCode: DiscountCodeData = {
    id: crypto.randomUUID(),
    code: trimmed,
    discount_pct: Number(discount_pct),
    duration_hours: Number(duration_hours),
    expires_at: expires_at.toISOString(),
    status: 'valid',
    created_at: new Date().toISOString(),
  }

  await redis.hset(key, newCode)
  await redis.sadd('discount_codes_index', key)

  return NextResponse.json(newCode)
}
