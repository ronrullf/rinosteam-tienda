import { GameCardSkeleton } from './GameCardSkeleton'

interface GameGridSkeletonProps {
  count?: number
}

export function GameGridSkeleton({ count = 10 }: GameGridSkeletonProps) {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-5 md:py-7">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5">
        {/* Primera card destacada */}
        <GameCardSkeleton featured />
        {/* Resto de cards normales */}
        {Array.from({ length: count - 1 }).map((_, i) => (
          <GameCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
