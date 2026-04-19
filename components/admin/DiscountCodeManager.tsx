'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DiscountCode } from '@/types'

const DURATION_OPTIONS = [1, 3, 5, 7]

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let result = 'RINO-'
  for (let i = 0; i < 6; i++) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}

function formatExpiry(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('es-VE', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function isExpired(dateStr: string): boolean {
  return new Date(dateStr) < new Date()
}

export function DiscountCodeManager() {
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [code, setCode] = useState(randomCode())
  const [discountPct, setDiscountPct] = useState(10)
  const [durationDays, setDurationDays] = useState(7)

  const loadCodes = useCallback(async () => {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('discount_codes')
      .select('*')
      .order('created_at', { ascending: false })
    setCodes(data ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { loadCodes() }, [loadCodes])

  async function handleCreate() {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) { setError('El código no puede estar vacío'); return }
    setCreating(true)
    setError('')
    setSuccess('')

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + durationDays)

    const supabase = createClient()
    const { error: err } = await supabase.from('discount_codes').insert({
      code: trimmed,
      discount_pct: discountPct,
      duration_days: durationDays,
      expires_at: expiresAt.toISOString(),
      is_active: true,
    })

    setCreating(false)
    if (err) {
      setError(err.message.includes('unique') ? 'Ya existe un código con ese nombre' : err.message)
    } else {
      setSuccess(`✅ Código "${trimmed}" creado — expira en ${durationDays} día(s)`)
      setCode(randomCode())
      loadCodes()
      setTimeout(() => setSuccess(''), 5000)
    }
  }

  async function handleDelete(id: string, codeStr: string) {
    if (!confirm(`¿Eliminar el código "${codeStr}"?`)) return
    setDeleting(id)
    const supabase = createClient()
    await supabase.from('discount_codes').delete().eq('id', id)
    setDeleting(null)
    loadCodes()
  }

  const activeCodes  = codes.filter(c => !isExpired(c.expires_at))
  const expiredCodes = codes.filter(c => isExpired(c.expires_at))

  return (
    <div className="flex flex-col gap-8 max-w-2xl">

      {/* Formulario crear código */}
      <div className="rounded-xl border p-5"
        style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
        <h3 className="font-heading text-xl mb-5" style={{ color: 'var(--text-primary)' }}>
          🎟 Crear código de descuento
        </h3>

        <div className="flex flex-col gap-4">

          {/* Código */}
          <div>
            <label className="font-sans text-[11px] uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
              Código
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                className="input-dark flex-1 font-mono tracking-widest"
                style={{ fontSize: '14px', textTransform: 'uppercase' }}
                placeholder="RINO-XXXXXX"
              />
              <button
                onClick={() => setCode(randomCode())}
                className="px-3 py-2 rounded-lg transition-all hover:opacity-80 text-lg"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                title="Generar código aleatorio"
              >
                🎲
              </button>
            </div>
          </div>

          {/* Descuento % */}
          <div>
            <label className="font-sans text-[11px] uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
              Descuento: <span className="font-heading text-xl" style={{ color: 'var(--orange-400)' }}>{discountPct}%</span>
            </label>
            <input
              type="range"
              min={5}
              max={50}
              step={5}
              value={discountPct}
              onChange={e => setDiscountPct(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between font-sans text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              <span>5%</span><span>50%</span>
            </div>
          </div>

          {/* Duración */}
          <div>
            <label className="font-sans text-[11px] uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
              Duración
            </label>
            <div className="flex gap-2">
              {DURATION_OPTIONS.map(d => (
                <button
                  key={d}
                  onClick={() => setDurationDays(d)}
                  className="flex-1 py-2.5 rounded-xl font-heading text-base transition-all active:scale-95"
                  style={{
                    backgroundColor: durationDays === d ? 'var(--orange-500)' : 'var(--bg-surface)',
                    color: durationDays === d ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${durationDays === d ? 'var(--orange-500)' : 'var(--border)'}`,
                  }}
                >
                  {d} día{d > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          {error   && <p className="font-sans text-[13px] rounded-lg px-3 py-2" style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>❌ {error}</p>}
          {success && <p className="font-sans text-[13px] rounded-lg px-3 py-2" style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E' }}>{success}</p>}

          <button
            onClick={handleCreate}
            disabled={creating}
            className="w-full py-3 rounded-xl font-heading text-lg transition-all active:scale-95"
            style={{ backgroundColor: 'var(--orange-500)', color: '#fff', opacity: creating ? 0.7 : 1 }}
          >
            {creating ? 'Creando...' : '✅ Crear código'}
          </button>
        </div>
      </div>

      {/* Códigos activos */}
      <div>
        <h3 className="font-heading text-lg mb-3" style={{ color: 'var(--text-primary)' }}>
          🟢 Activos ({activeCodes.length})
        </h3>
        {loading ? (
          <p className="font-sans text-[13px]" style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        ) : activeCodes.length === 0 ? (
          <p className="font-sans text-[13px] italic" style={{ color: 'var(--text-muted)' }}>No hay códigos activos</p>
        ) : (
          <div className="flex flex-col gap-2">
            {activeCodes.map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border p-4"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'rgba(34,197,94,0.3)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono font-bold text-[16px] tracking-widest" style={{ color: 'var(--text-primary)' }}>
                      {c.code}
                    </span>
                    <span className="px-2 py-0.5 rounded-full font-heading text-[13px]"
                      style={{ backgroundColor: 'rgba(34,197,94,0.15)', color: '#22C55E' }}>
                      -{c.discount_pct}%
                    </span>
                    <span className="px-2 py-0.5 rounded-full font-sans text-[11px]"
                      style={{ backgroundColor: 'rgba(249,115,22,0.1)', color: 'var(--orange-400)' }}>
                      {c.duration_days}d
                    </span>
                  </div>
                  <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                    ⏳ Expira: {formatExpiry(c.expires_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(c.id, c.code)}
                  disabled={deleting === c.id}
                  className="px-3 py-2 rounded-lg font-sans text-[12px] font-semibold transition-all hover:opacity-80 flex-shrink-0"
                  style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}
                >
                  {deleting === c.id ? '...' : '🗑 Eliminar'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Códigos expirados */}
      {expiredCodes.length > 0 && (
        <div>
          <h3 className="font-heading text-base mb-3" style={{ color: 'var(--text-muted)' }}>
            🔴 Expirados ({expiredCodes.length})
          </h3>
          <div className="flex flex-col gap-2">
            {expiredCodes.slice(0, 8).map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border p-3 opacity-50"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[13px] line-through tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      {c.code}
                    </span>
                    <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      -{c.discount_pct}%
                    </span>
                  </div>
                  <p className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Expiró: {formatExpiry(c.expires_at)}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(c.id, c.code)}
                  className="px-2 py-1 rounded font-sans text-[11px] hover:opacity-80"
                  style={{ color: 'var(--text-muted)' }}
                >
                  🗑
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
