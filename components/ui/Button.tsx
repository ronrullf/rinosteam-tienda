'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  fullWidth?: boolean
  pulse?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  fullWidth = false,
  pulse = false,
  className,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center font-sans font-semibold rounded-lg transition-colors duration-150 select-none'

  const variants = {
    primary:
      'bg-[--orange-500] hover:bg-[--orange-600] active:bg-[--orange-600] text-white',
    secondary:
      'bg-[--bg-elevated] hover:bg-[--bg-surface] border border-[--border] text-[--text-primary]',
    danger: 'bg-[--danger] hover:bg-red-700 text-white',
    ghost:
      'bg-transparent border border-[--border] text-[--text-secondary] hover:border-[--border-strong]',
  }

  const sizes = {
    sm: 'text-sm px-3 py-2 min-h-[36px]',
    md: 'text-[15px] px-4 py-3 min-h-[44px]',
    lg: 'text-base px-5 py-3 min-h-[48px]',
  }

  return (
    <button
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        pulse && 'animate-pulse-orange',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
