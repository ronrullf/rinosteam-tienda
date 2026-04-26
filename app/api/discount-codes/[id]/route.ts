import { NextResponse } from 'next/server'
import { redis } from '@/lib/redis'

/** PATCH /api/discount-codes/[id] — desactiva un código (valid → expired) */
export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  // El id que llega es el código (ej: "RINO-ABCDEF")
  const key = `discount:${params.id}`
  const exists = await redis.exists(key)
  if (!exists) return NextResponse.json({ error: 'Código no encontrado' }, { status: 404 })

  await redis.hset(key, { status: 'expired' })
  return NextResponse.json({ success: true })
}

/** DELETE /api/discount-codes/[id] — elimina el código */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const key = `discount:${params.id}`
  await redis.del(key)
  await redis.srem('discount_codes_index', key)
  return NextResponse.json({ success: true })
}
