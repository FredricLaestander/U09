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
