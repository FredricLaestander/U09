import { cva, type VariantProps } from 'class-variance-authority'
import type { LucideIcon } from 'lucide-react'
import type { ElementType } from 'react'
import type { Polymorphic } from '../types'
import { cn } from '../utils/classname'

const variants = cva(
  'flex items-center justify-center text-base font-bold whitespace-nowrap rounded-full transition cursor-pointer disabled:bg-slate-600 disabled:text-slate-800 disabled:cursor-auto',
  {
    variants: {
      variant: {
        primary: 'bg-slate-800 text-slate-50 hover:bg-slate-950',
        blue: 'bg-blue text-slate-800 hover:bg-blue-darker',
        green: 'bg-green text-slate-800 hover:bg-green-darker',
        red: 'bg-red text-slate-50 hover:bg-red-darker',
      },
      size: {
        md: 'py-3 px-8 gap-3',
        sm: 'py-2 px-6 gap-2',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  },
)

export const Button = <Element extends ElementType = 'button'>({
  as,
  children,
  icon: Icon,
  variant,
  size,
  className,
  ...rest
}: Polymorphic<
  VariantProps<typeof variants> & { icon?: LucideIcon },
  Element
>) => {
  const Element = as || 'button'

  return (
    <Element className={cn(variants({ variant, size, className }))} {...rest}>
      {Icon && (
        <Icon
          className={cn(size === 'md' && 'size-6', size === 'sm' && 'size-4')}
        />
      )}
      {children}
    </Element>
  )
}
