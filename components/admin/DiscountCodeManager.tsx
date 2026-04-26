'use client'

import { useState, useEffect, useCallback } from 'react'

interface DurationOption {
  label: string
  hours: number
}

const DURATION_OPTIONS: DurationOption[] = [
  { label: '1h',      hours: 1   },
  { label: '4h',      hours: 4   },
  { label: '12h',     hours: 12  },
  { label: '24h',     hours: 24  },
  { label: '3 días',  hours: 72  },
  { label: '5 días',  hours: 120 },
  { label: '7 días',  hours: 168 },
]

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

function timeLeft(dateStr: string): string {
  const diff = new Date(dateStr).getTime() - Date.now()
  if (diff <= 0) return 'Expirado'
  const days  = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  if (days > 0)  return `${days}d ${hours}h restantes`
  if (hours > 0) return `${hours}h ${mins}m restantes`
  return `${mins}m restantes`
}

interface DiscountCode {
  id: string
  code: string
  discount_pct: number
  duration_hours: number
  expires_at: string
  status: 'valid' | 'expired'
  created_at: string
}

export function DiscountCodeManager() {
  const [codes, setCodes] = useState<DiscountCode[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [copied, setCopied] = useState<string | null>(null)

  const [code, setCode] = useState(randomCode())
  const [discountPct, setDiscountPct] = useState(10)
  const [selectedHours, setSelectedHours] = useState(168) // 7 días por defecto

  const loadCodes = useCallback(async () => {
    setLoading(true)
    try {
      const res  = await fetch('/api/discount-codes')
      const data = await res.json()
      setCodes(Array.isArray(data) ? data : [])
    } catch {
      setCodes([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { loadCodes() }, [loadCodes])

  async function handleCreate() {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) { setError('El código no puede estar vacío'); return }
    setCreating(true)
    setError('')
    setSuccess('')

    const res  = await fetch('/api/discount-codes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: trimmed, discount_pct: discountPct, duration_hours: selectedHours }),
    })
    const data = await res.json()
    setCreating(false)

    if (!res.ok) {
      setError(data.error ?? 'Error al crear el código')
    } else {
      const opt = DURATION_OPTIONS.find(o => o.hours === selectedHours)
      setSuccess(`✅ Código "${trimmed}" creado — válido por ${opt?.label ?? selectedHours + 'h'}`)
      setCode(randomCode())
      loadCodes()
      setTimeout(() => setSuccess(''), 5000)
    }
  }

  async function handleDeactivate(id: string, codeStr: string) {
    if (!confirm(`¿Desactivar el código "${codeStr}"? No podrá usarse más.`)) return
    setActionId(id)
    await fetch(`/api/discount-codes/${codeStr}`, { method: 'PATCH' })
    setActionId(null)
    loadCodes()
  }

  async function handleDelete(id: string, codeStr: string) {
    if (!confirm(`¿Eliminar permanentemente "${codeStr}"?`)) return
    setActionId(id)
    await fetch(`/api/discount-codes/${codeStr}`, { method: 'DELETE' })
    setActionId(null)
    loadCodes()
  }

  async function handleCopy(codeStr: string) {
    await navigator.clipboard.writeText(codeStr)
    setCopied(codeStr)
    setTimeout(() => setCopied(null), 2000)
  }

  const activeCodes  = codes.filter(c => c.status === 'valid' && new Date(c.expires_at) > new Date())
  const expiredCodes = codes.filter(c => c.status === 'expired' || new Date(c.expires_at) <= new Date())

  return (
    <div className="flex flex-col gap-8 max-w-2xl">

      {/* Formulario crear */}
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
                style={{ fontSize: '14px' }}
                placeholder="RINO-XXXXXX"
              />
              <button
                onClick={() => setCode(randomCode())}
                className="px-3 py-2 rounded-lg transition-all hover:opacity-80 text-lg"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
                title="Generar código aleatorio"
              >🎲</button>
            </div>
          </div>

          {/* Descuento % */}
          <div>
            <label className="font-sans text-[11px] uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
              Descuento:{' '}
              <span className="font-heading text-xl" style={{ color: 'var(--orange-400)' }}>{discountPct}%</span>
            </label>
            <input
              type="range" min={5} max={95} step={5} value={discountPct}
              onChange={e => setDiscountPct(Number(e.target.value))}
              className="w-full accent-orange-500"
            />
            <div className="flex justify-between font-sans text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
              <span>5%</span><span>95%</span>
            </div>
          </div>

          {/* Duración */}
          <div>
            <label className="font-sans text-[11px] uppercase tracking-wide mb-1.5 block" style={{ color: 'var(--text-muted)' }}>
              Duración
            </label>
            <div className="grid grid-cols-4 gap-2">
              {DURATION_OPTIONS.map(opt => (
                <button
                  key={opt.hours}
                  onClick={() => setSelectedHours(opt.hours)}
                  className="py-2 rounded-xl font-heading text-sm transition-all active:scale-95"
                  style={{
                    backgroundColor: selectedHours === opt.hours ? 'var(--orange-500)' : 'var(--bg-surface)',
                    color: selectedHours === opt.hours ? '#fff' : 'var(--text-secondary)',
                    border: `1px solid ${selectedHours === opt.hours ? 'var(--orange-500)' : 'var(--border)'}`,
                  }}
                >
                  {opt.label}
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
                    <span className="px-2 py-0.5 rounded-full font-sans text-[10px] font-bold"
                      style={{ backgroundColor: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.3)' }}>
                      VÁLIDO
                    </span>
                  </div>
                  <p className="font-sans text-[12px] mt-1 font-semibold" style={{ color: '#22C55E' }}>
                    ⏳ {timeLeft(c.expires_at)}
                  </p>
                  <p className="font-sans text-[10px]" style={{ color: 'var(--text-muted)' }}>
                    Expira: {formatExpiry(c.expires_at)}
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {/* Copiar */}
                  <button
                    onClick={() => handleCopy(c.code)}
                    className="px-3 py-2 rounded-lg font-sans text-[12px] font-semibold transition-all hover:opacity-80"
                    style={{
                      backgroundColor: copied === c.code ? 'rgba(34,197,94,0.15)' : 'var(--bg-surface)',
                      color: copied === c.code ? '#22C55E' : 'var(--text-secondary)',
                      border: `1px solid ${copied === c.code ? 'rgba(34,197,94,0.4)' : 'var(--border)'}`,
                    }}
                    title="Copiar código"
                  >
                    {copied === c.code ? '✅' : '📋'}
                  </button>
                  {/* Desactivar */}
                  <button
                    onClick={() => handleDeactivate(c.id, c.code)}
                    disabled={actionId === c.id}
                    className="px-3 py-2 rounded-lg font-sans text-[12px] font-semibold transition-all hover:opacity-80"
                    style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444', border: '1px solid rgba(239,68,68,0.25)' }}
                  >
                    {actionId === c.id ? '...' : '⛔'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Códigos expirados */}
      {!loading && expiredCodes.length > 0 && (
        <div>
          <h3 className="font-heading text-base mb-3" style={{ color: 'var(--text-muted)' }}>
            🔴 Expirados / Desactivados ({expiredCodes.length})
          </h3>
          <div className="flex flex-col gap-2">
            {expiredCodes.slice(0, 10).map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-xl border p-3 opacity-60"
                style={{ backgroundColor: 'var(--bg-elevated)', borderColor: 'var(--border)' }}>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-[13px] line-through tracking-widest" style={{ color: 'var(--text-muted)' }}>
                      {c.code}
                    </span>
                    <span className="font-sans text-[11px]" style={{ color: 'var(--text-muted)' }}>
                      -{c.discount_pct}%
                    </span>
                    <span className="px-1.5 py-0.5 rounded font-sans text-[10px] font-bold"
                      style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444' }}>
                      {c.status === 'expired' && new Date(c.expires_at) > new Date() ? 'DESACTIVADO' : 'EXPIRADO'}
                    </span>
                  </div>
                  <p className="font-sans text-[10px] mt-0.5" style={{ color: 'var(--text-muted)' }}>
                    {c.status === 'expired' && new Date(c.expires_at) > new Date()
                      ? 'Desactivado manualmente'
                      : `Expiró: ${formatExpiry(c.expires_at)}`}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(c.id, c.code)}
                  disabled={actionId === c.id}
                  className="px-2 py-1 rounded font-sans text-[11px] hover:opacity-80 flex-shrink-0"
                  style={{ color: '#EF4444' }}
                >
                  {actionId === c.id ? '...' : '🗑'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
