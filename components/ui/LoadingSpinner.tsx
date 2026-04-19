import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeStyles = {
  sm: { width: '16px', height: '16px', borderWidth: '2px' },
  md: { width: '32px', height: '32px', borderWidth: '2px' },
  lg: { width: '48px', height: '48px', borderWidth: '3px' },
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const { width, height, borderWidth } = sizeStyles[size]

  return (
    <div
      className={cn('rounded-full animate-spin', className)}
      style={{
        width,
        height,
        borderWidth,
        borderStyle: 'solid',
        borderColor: 'var(--bg-elevated)',
        borderTopColor: 'var(--orange-500)',
      }}
      role="status"
      aria-label="Cargando..."
    />
  )
}
