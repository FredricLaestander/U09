import type { Participant } from '../types/utils'

export const calculateScore = (cards: Participant['cards']) => {
  let hard = 0
  let soft = 0

  for (const card of cards) {
    if (!card.open) continue

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
