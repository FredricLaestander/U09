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

export type Card = {
  suit: string
  value: string
}

export type Deck = {
  cards: Card[]
  deck_id: string
  remaining: number
}
