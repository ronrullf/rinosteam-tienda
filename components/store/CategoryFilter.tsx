'use client'

import { CATEGORIES } from '@/types'

interface CategoryFilterProps {
  active: string
  onChange: (cat: string) => void
}

const ALL = 'Todos'

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const pills = [ALL, ...CATEGORIES]

  return (
    <div
      className="sticky top-14 md:top-16 z-30 border-b"
      style={{
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
    >
      {/* En mobile: scroll horizontal. En desktop: wrap centrado */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide scroll-momentum py-2.5 md:flex-wrap md:overflow-x-visible md:justify-start md:py-3">
          {pills.map((cat) => {
            const isActive = active === cat
            return (
              <button
                key={cat}
                onClick={() => onChange(cat)}
                className="whitespace-nowrap px-3 py-1.5 md:px-4 md:py-2 rounded-full font-sans text-[13px] font-medium transition-colors duration-150 border flex-shrink-0"
                style={{
                  backgroundColor: isActive ? 'var(--orange-500)' : 'transparent',
                  borderColor: isActive ? 'var(--orange-500)' : 'var(--border)',
                  color: isActive ? '#fff' : 'var(--text-secondary)',
                  minHeight: '32px',
                }}
                aria-pressed={isActive}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
