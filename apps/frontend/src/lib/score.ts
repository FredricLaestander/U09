import type { Card } from '../types/data'

export const calculateScore = (cards: Card[]) => {
  let hard = 0
  let soft = 0

  for (const card of cards) {
    if (card.value === 'A') {
      hard += 1
      soft += 11
    } else if (['J', 'Q', 'K'].includes(card.value)) {
      hard += 10
      soft += 10
    } else {
      hard += Number(card.value)
      soft += Number(card.value)
    }
  }

  return { hard, soft }
}
