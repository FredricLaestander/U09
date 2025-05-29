import type { ComponentPropsWithoutRef, ElementType } from 'react'

export type Suit = 'heart' | 'diamond' | 'club' | 'spade'
export type Face = 'jack' | 'queen' | 'king'

type Merge<T, U> = Omit<T, keyof U> & U

export type Polymorphic<Props, Element extends ElementType> = Merge<
  ComponentPropsWithoutRef<Element>,
  Props & { as?: Element }
>
