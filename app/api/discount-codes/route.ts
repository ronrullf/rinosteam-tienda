import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

/** GET /api/discount-codes — lista todos los códigos */
export async function GET() {
  const supabase = adminClient()

  // Auto-expirar códigos que se pasaron de tiempo
  await supabase
    .from('discount_codes')
    .update({ status: 'expired' })
    .eq('status', 'valid')
    .lt('expires_at', new Date().toISOString())

  const { data, error } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? [])
}

/** POST /api/discount-codes — crea un nuevo código */
export async function POST(req: Request) {
  const body = await req.json()
  const { code, discount_pct, duration_days } = body

  if (!code || !discount_pct || !duration_days) {
    return NextResponse.json({ error: 'Faltan campos requeridos' }, { status: 400 })
  }

  const expires_at = new Date()
  expires_at.setDate(expires_at.getDate() + Number(duration_days))

  const supabase = adminClient()
  const { data, error } = await supabase
    .from('discount_codes')
    .insert({
      code: String(code).trim().toUpperCase(),
      discount_pct: Number(discount_pct),
      duration_days: Number(duration_days),
      expires_at: expires_at.toISOString(),
      status: 'valid',
    })
    .select()
    .single()

  if (error) {
    const msg = error.message.includes('unique')
      ? 'Ya existe un código con ese nombre'
      : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  return NextResponse.json(data)
}
