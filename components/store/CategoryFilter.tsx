'use client'

import { CATEGORIES, Category } from '@/types'

interface CategoryFilterProps {
  active: string
  onChange: (cat: string) => void
}

const ALL = 'Todos'

export function CategoryFilter({ active, onChange }: CategoryFilterProps) {
  const pills = [ALL, ...CATEGORIES]

  return (
    <div
      className="sticky z-30 border-b scroll-momentum"
      style={{
        top: '56px',
        backgroundColor: 'var(--bg-surface)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="flex gap-2 overflow-x-auto scrollbar-hide px-3 py-2.5">
        {pills.map((cat) => {
          const isActive = active === cat
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full font-sans text-[13px] font-medium transition-colors duration-150 border flex-shrink-0"
              style={{
                backgroundColor: isActive
                  ? 'var(--orange-500)'
                  : 'transparent',
                borderColor: isActive
                  ? 'var(--orange-500)'
                  : 'var(--border)',
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
  )
}
