import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

/** POST /api/discount-codes/validate — valida un código de descuento */
export async function POST(req: Request) {
  const { code } = await req.json()

  if (!code) {
    return NextResponse.json({ valid: false, message: 'Código inválido' })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { data } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', String(code).trim().toUpperCase())
    .single()

  // No existe
  if (!data) {
    return NextResponse.json({ valid: false, message: 'Código inválido o no existe' })
  }

  // Expirado por tiempo o desactivado manualmente
  const isExpiredByTime   = new Date(data.expires_at) < new Date()
  const isExpiredByStatus = data.status === 'expired'

  if (isExpiredByTime || isExpiredByStatus) {
    // Si expiró por tiempo pero no está marcado, actualizamos el status
    if (isExpiredByTime && !isExpiredByStatus) {
      await supabase
        .from('discount_codes')
        .update({ status: 'expired' })
        .eq('id', data.id)
    }
    return NextResponse.json({ valid: false, message: 'Este código ha expirado' })
  }

  return NextResponse.json({ valid: true, discount_pct: data.discount_pct })
}
