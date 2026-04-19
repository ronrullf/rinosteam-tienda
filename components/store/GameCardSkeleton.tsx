export function GameCardSkeleton({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={`rounded-card overflow-hidden border flex flex-col${featured ? ' md:col-span-2' : ''}`}
      style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border)' }}
      aria-hidden="true"
    >
      {/* Imagen skeleton */}
      <div
        className="skeleton-shimmer w-full flex-shrink-0"
        style={{ aspectRatio: featured ? '16/9' : '3/4' }}
      />

      {/* Info skeleton */}
      <div className="flex flex-col gap-2 p-3 md:p-4 flex-1">
        {/* Título */}
        <div className="skeleton-shimmer h-5 rounded-md w-4/5" />
        <div className="skeleton-shimmer h-4 rounded-md w-2/5" />

        {/* Estrellas */}
        <div className="skeleton-shimmer h-3 rounded-md w-24 mt-1" />

        {/* Precio */}
        <div className="flex items-baseline gap-2 mt-auto pt-1">
          <div className="skeleton-shimmer h-3 rounded w-10" />
          <div className="skeleton-shimmer h-7 rounded w-16" />
        </div>

        {/* Botón */}
        <div className="skeleton-shimmer h-11 rounded-lg w-full mt-2" />
      </div>
    </div>
  )
}
