import type { ComponentPropsWithoutRef, ElementType } from 'react'
import type { Card } from './data'

export type Number = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
export type Value = Number | 'J' | 'Q' | 'K' | 'A'
export type Suit = 'heart' | 'diamond' | 'club' | 'spade'

export type Participant = {
  cards: (Card & { id: string; open: boolean })[]
  score: {
    soft: number
    hard: number
    cardLength: number
  }
}

export type Winner = 'dealer' | 'player' | 'tie' | null
export type Outcome = 'win' | 'loss' | 'tie'

export type Face = 'jack' | 'queen' | 'king'
export type Illustration = 'fire' | 'crown' | 'cloud'

type Merge<T, U> = Omit<T, keyof U> & U

export type Polymorphic<Props, Element extends ElementType> = Merge<
  ComponentPropsWithoutRef<Element>,
  Props & { as?: Element }
>
