'use client'

import { useState, useRef, DragEvent, ChangeEvent } from 'react'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { generateSlug } from '@/lib/utils'
import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  gameTitle?: string
}

const MAX_MB = 2
const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp']

export function ImageUploader({ value, onChange, gameTitle }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  async function upload(file: File) {
    setError('')

    if (!ACCEPTED.includes(file.type)) {
      setError('Solo se aceptan JPG, PNG o WEBP')
      return
    }

    if (file.size > MAX_MB * 1024 * 1024) {
      setError(`La imagen no debe superar ${MAX_MB}MB`)
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()
      const slug = gameTitle ? generateSlug(gameTitle) : 'game'
      const ext = file.name.split('.').pop() ?? 'jpg'
      const filename = `${slug}-${Date.now()}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('game-images')
        .upload(filename, file, { upsert: false, contentType: file.type })

      if (uploadError) throw uploadError

      const { data } = supabase.storage
        .from('game-images')
        .getPublicUrl(filename)

      onChange(data.publicUrl)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error al subir imagen'
      setError(msg)
    } finally {
      setUploading(false)
    }
  }

  function onFileChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) upload(file)
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) upload(file)
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className="relative rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-150 overflow-hidden"
        style={{
          minHeight: '180px',
          borderColor: dragging ? 'var(--orange-500)' : 'var(--border)',
          backgroundColor: dragging ? 'rgba(249,115,22,0.05)' : 'var(--bg-elevated)',
        }}
      >
        {uploading ? (
          <LoadingSpinner size="lg" />
        ) : value ? (
          <>
            <Image
              src={value}
              alt="Preview"
              fill
              className="object-cover"
              sizes="400px"
            />
            <div
              className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
              style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
            >
              <span className="text-white font-sans text-sm font-medium">
                Cambiar imagen
              </span>
            </div>
          </>
        ) : (
          <>
            <span className="text-3xl">🖼️</span>
            <p
              className="font-sans text-[13px] text-center px-4"
              style={{ color: 'var(--text-secondary)' }}
            >
              Arrastra una imagen aquí o toca para seleccionar
            </p>
            <p
              className="font-sans text-[11px]"
              style={{ color: 'var(--text-muted)' }}
            >
              JPG, PNG, WEBP — máx. 2MB
            </p>
          </>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPTED.join(',')}
        className="hidden"
        onChange={onFileChange}
      />

      {error && (
        <p
          className="font-sans text-[13px] px-3 py-2 rounded-lg"
          style={{
            color: 'var(--danger)',
            backgroundColor: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.25)',
          }}
        >
          ⚠️ {error}
        </p>
      )}
    </div>
  )
}
