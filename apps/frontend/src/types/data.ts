import { z } from 'zod'
import type { Suit, Value } from './utils'

export type User = {
  username?: string
  givenName?: string
  statistics: {
    streak: number
    longestStreak: number
    wins: number
    losses: number
    ties: number
  }
}

const suits = ['CLUBS', 'HEARTS', 'DIAMONDS', 'SPADES'] as const
const suitMap: Record<(typeof suits)[number], Suit> = {
  CLUBS: 'club',
  HEARTS: 'heart',
  DIAMONDS: 'diamond',
  SPADES: 'spade',
}

const values = [
  'ACE',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'JACK',
  'QUEEN',
  'KING',
] as const
const valueMap: Record<(typeof values)[number], Value> = {
  ACE: 'A',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  JACK: 'J',
  QUEEN: 'Q',
  KING: 'K',
}

export const cardSchema = z.object({
  suit: z.enum(suits).transform((suit) => suitMap[suit]),
  value: z.enum(values).transform((value) => valueMap[value]),
})

export const deckSchema = z.object({
  deck_id: z.string(),
  remaining: z.number(),
  cards: z.array(cardSchema),
})
