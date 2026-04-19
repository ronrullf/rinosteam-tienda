import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  variant?: 'discount' | 'hot' | 'stock' | 'category'
  className?: string
  shine?: boolean
}

export function Badge({
  children,
  variant = 'discount',
  className,
  shine = false,
}: BadgeProps) {
  const variants = {
    discount: shine
      ? 'animate-shine text-white'
      : 'bg-[--orange-500] text-white',
    hot: 'bg-red-600 text-white',
    stock: 'bg-[--gold] text-black',
    category: 'bg-[--bg-elevated] border border-[--border] text-[--text-secondary]',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 rounded text-[11px] font-sans font-semibold uppercase tracking-wide',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
