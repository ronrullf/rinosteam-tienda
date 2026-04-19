'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'
import { CATEGORIES, Category } from '@/types'
import type { Game, GameFormData } from '@/types'
import { Button } from '@/components/ui/Button'
import { ImageUploader } from './ImageUploader'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface GameFormProps {
  game?: Game
  onSuccess: () => void
}

const DEFAULT_FORM: GameFormData = {
  title: '',
  description: '',
  original_price: '',
  sale_price: '',
  category: 'Acción',
  is_featured: false,
  is_active: true,
  stock_note: '',
  image_url: '',
}

export function GameForm({ game, onSuccess }: GameFormProps) {
  const [form, setForm] = useState<GameFormData>(
    game
      ? {
          title: game.title,
          description: game.description ?? '',
          original_price: String(game.original_price),
          sale_price: String(game.sale_price),
          category: game.category,
          is_featured: game.is_featured,
          is_active: game.is_active,
          stock_note: game.stock_note ?? '',
          image_url: game.image_url,
        }
      : DEFAULT_FORM
  )

  const [errors, setErrors] = useState<Partial<Record<keyof GameFormData, string>>>({})
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')

  function set<K extends keyof GameFormData>(key: K, val: GameFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  function validate(): boolean {
    const e: Partial<Record<keyof GameFormData, string>> = {}

    if (!form.title.trim()) e.title = 'El título es requerido'
    if (form.title.length > 80) e.title = 'Máximo 80 caracteres'

    const orig = parseFloat(form.original_price)
    const sale = parseFloat(form.sale_price)

    if (!form.original_price || isNaN(orig) || orig <= 0)
      e.original_price = 'Ingresa un precio válido mayor a 0'
    if (!form.sale_price || isNaN(sale) || sale <= 0)
      e.sale_price = 'Ingresa un precio válido mayor a 0'
    if (!isNaN(orig) && !isNaN(sale) && sale >= orig)
      e.sale_price = 'El precio de venta debe ser menor al original'
    if (!form.image_url) e.image_url = 'La imagen es requerida'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    setSuccessMsg('')

    try {
      const supabase = createClient()

      const payload = {
        title: form.title.trim(),
        slug: generateSlug(form.title.trim()),
        description: form.description.trim() || null,
        original_price: parseFloat(form.original_price),
        sale_price: parseFloat(form.sale_price),
        category: form.category,
        is_featured: form.is_featured,
        is_active: form.is_active,
        stock_note: form.stock_note.trim() || null,
        image_url: form.image_url,
        updated_at: new Date().toISOString(),
      }

      if (game) {
        const { error } = await supabase
          .from('games')
          .update(payload)
          .eq('id', game.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('games').insert(payload)
        if (error) throw error
      }

      setSuccessMsg(game ? '¡Juego actualizado!' : '¡Juego publicado en la tienda!')
      if (!game) setForm(DEFAULT_FORM)
      onSuccess()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al guardar'
      setErrors({ title: msg })
    } finally {
      setSaving(false)
    }
  }

  function InputField({
    id,
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    errorKey,
    maxLength,
  }: {
    id: keyof GameFormData
    label: string
    type?: string
    placeholder?: string
    value: string
    onChange: (v: string) => void
    errorKey?: keyof GameFormData
    maxLength?: number
  }) {
    const errKey = errorKey ?? id
    return (
      <div>
        <label
          htmlFor={id}
          className="block font-sans text-[13px] font-medium mb-1.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          {label}
        </label>
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          maxLength={maxLength}
          className="input-dark"
        />
        {errors[errKey] && (
          <p className="font-sans text-[12px] mt-1" style={{ color: 'var(--danger)' }}>
            {errors[errKey]}
          </p>
        )}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 pb-10">
      {/* Imagen */}
      <div>
        <label
          className="block font-sans text-[13px] font-medium mb-1.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          Imagen del juego *
        </label>

        {/* Opción A: Pegar URL directa */}
        <div className="mb-3">
          <input
            type="url"
            placeholder="https://... (pega una URL de imagen directamente)"
            value={form.image_url}
            onChange={(e) => set('image_url', e.target.value)}
            className="input-dark"
          />
          <p className="font-sans text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
            Pega una URL de imagen — o sube un archivo abajo ↓
          </p>
        </div>

        {/* Opción B: Subir archivo a Storage */}
        <ImageUploader
          value={form.image_url}
          onChange={(url) => set('image_url', url)}
          gameTitle={form.title}
        />
        {errors.image_url && (
          <p className="font-sans text-[12px] mt-1" style={{ color: 'var(--danger)' }}>
            {errors.image_url}
          </p>
        )}
      </div>

      <InputField
        id="title"
        label="Título del juego *"
        placeholder="Ej: Resident Evil 9"
        value={form.title}
        onChange={(v) => set('title', v)}
        maxLength={80}
      />

      <InputField
        id="original_price"
        label="Precio original ($USD) *"
        type="number"
        placeholder="59.99"
        value={form.original_price}
        onChange={(v) => set('original_price', v)}
      />

      <InputField
        id="sale_price"
        label="Precio de venta ($USD) *"
        type="number"
        placeholder="4.99"
        value={form.sale_price}
        onChange={(v) => set('sale_price', v)}
      />

      {/* Categoría */}
      <div>
        <label
          htmlFor="category"
          className="block font-sans text-[13px] font-medium mb-1.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          Categoría
        </label>
        <select
          id="category"
          value={form.category}
          onChange={(e) => set('category', e.target.value as Category)}
          className="input-dark"
          style={{ cursor: 'pointer' }}
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Descripción */}
      <div>
        <label
          htmlFor="description"
          className="block font-sans text-[13px] font-medium mb-1.5"
          style={{ color: 'var(--text-secondary)' }}
        >
          Descripción breve
        </label>
        <textarea
          id="description"
          rows={3}
          placeholder="Descripción corta del juego..."
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          className="input-dark resize-none"
        />
      </div>

      {/* Checkboxes */}
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_featured}
            onChange={(e) => set('is_featured', e.target.checked)}
            className="w-5 h-5 accent-orange-500"
          />
          <span className="font-sans text-[14px]" style={{ color: 'var(--text-primary)' }}>
            🔥 Juego destacado (HOT)
          </span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => set('is_active', e.target.checked)}
            className="w-5 h-5 accent-orange-500"
          />
          <span className="font-sans text-[14px]" style={{ color: 'var(--text-primary)' }}>
            ✅ Activo en tienda
          </span>
        </label>
      </div>

      {/* Nota de stock */}
      <InputField
        id="stock_note"
        label="Nota de stock (opcional)"
        placeholder="Ej: ¡Pocas cuentas disponibles!"
        value={form.stock_note}
        onChange={(v) => set('stock_note', v)}
      />

      {/* Mensajes */}
      {successMsg && (
        <p
          className="font-sans text-[14px] text-center py-3 rounded-xl"
          style={{
            color: 'var(--success)',
            backgroundColor: 'rgba(34,197,94,0.08)',
            border: '1px solid rgba(34,197,94,0.25)',
          }}
        >
          ✅ {successMsg}
        </p>
      )}

      <Button
        type="submit"
        variant="primary"
        fullWidth
        disabled={saving}
        className="font-heading tracking-wide text-base"
      >
        {saving ? (
          <span className="flex items-center gap-2">
            <LoadingSpinner size="sm" />
            Guardando...
          </span>
        ) : game ? (
          'ACTUALIZAR JUEGO'
        ) : (
          'GUARDAR JUEGO'
        )}
      </Button>
    </form>
  )
}
