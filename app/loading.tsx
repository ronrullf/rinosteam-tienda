import { LoadingSpinner } from '@/components/ui/LoadingSpinner'

export default function Loading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="font-heading text-xl md:text-2xl animate-pulse" style={{ color: 'var(--orange-400)' }}>
          CARGANDO TIENDA...
        </p>
      </div>
    </div>
  )
}
