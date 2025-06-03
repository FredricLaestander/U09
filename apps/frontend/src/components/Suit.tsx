import type { Suit as TSuit } from '../types/utils'
import { cn } from '../utils/classname'

export const Suit = ({
  variant,
  size,
  face = false,
  classname,
}: {
  variant: TSuit
  size: 'sm' | 'md' | 'lg'
  face?: boolean
  classname?: string
}) => {
  return (
    <img
      src={`/suits/${variant}${face ? '-face' : ''}.svg`}
      alt={`${variant}`}
      className={cn(
        size === 'sm' && 'w-full max-w-4',
        size === 'md' && 'w-full max-w-6',
        size === 'lg' && 'w-full max-w-16',
        classname,
      )}
    />
  )
}
