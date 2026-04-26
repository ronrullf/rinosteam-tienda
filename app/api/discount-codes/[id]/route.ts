import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/** PATCH /api/discount-codes/[id] — desactiva un código (valid → expired) */
export async function PATCH(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = adminClient()
  const { error } = await supabase
    .from('discount_codes')
    .update({ status: 'expired' })
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}

/** DELETE /api/discount-codes/[id] — elimina el código de la BD */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const supabase = adminClient()
  const { error } = await supabase
    .from('discount_codes')
    .delete()
    .eq('id', params.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })
  return NextResponse.json({ success: true })
}
