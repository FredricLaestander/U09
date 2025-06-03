export type User = {
  username?: string
  statistics: {
    streak: number
    longestStreak: number
    wins: number
    losses: number
    ties: number
  }
}
