import type { ComponentPropsWithoutRef, ElementType } from 'react'
import type { z } from 'zod'
import type { cardSchema, deckSchema } from './data'

export type Number = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
export type Value = Number | 'J' | 'Q' | 'K' | 'A'
export type Suit = 'heart' | 'diamond' | 'club' | 'spade'

export type Deck = Omit<z.infer<typeof deckSchema>, 'cards'>
export type Card = z.infer<typeof cardSchema> & { id: string; open: boolean }
type Score = {
  soft: number
  hard: number
  cardLength: number
}

export type Status = 'waiting' | 'playing' | 'done'
export type Hand = {
  id: string
  cards: Card[]
  score: Score
  status: Status
}

export type Dealer = Omit<Hand, 'id' | 'status'>
export type Player = {
  hands: Hand[]
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
