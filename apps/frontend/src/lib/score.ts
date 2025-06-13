import type { Hand, Outcome, Winner } from '../types/utils'

export const calculateScore = (cards: Hand['cards']): Hand['score'] => {
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

  return { hard, soft, cardLength: cards.length }
}

const getHighestValidScore = (score: Hand['score']) => {
  if (score.soft <= 21) {
    return score.soft
  }

  if (score.hard <= 21) {
    return score.hard
  }

  return null
}

export const has21 = (score: Hand['score']) => {
  if (score.soft === 21 || score.hard === 21) {
    return true
  }

  return false
}

export const hasBlackjack = (score: Hand['score']) => {
  if (has21(score) && score.cardLength === 2) {
    return true
  }

  return false
}

export const isSoftBust = (score: Hand['score']) => {
  return score.soft > 21
}

export const isHardBust = (score: Hand['score']) => {
  return score.hard > 21
}

export const getWinner = (
  dealerScore: Hand['score'],
  playerScore: Hand['score'],
): NonNullable<Winner> => {
  const highestDealerScore = getHighestValidScore(dealerScore)
  const highestPlayerScore = getHighestValidScore(playerScore)

  if (hasBlackjack(dealerScore) && hasBlackjack(playerScore)) {
    return 'tie'
  }

  if (hasBlackjack(playerScore)) {
    return 'player'
  }

  if (!highestPlayerScore) {
    return 'dealer'
  }

  if (!highestDealerScore) {
    return 'player'
  }

  if (highestPlayerScore > highestDealerScore) {
    return 'player'
  }

  if (highestDealerScore > highestPlayerScore) {
    return 'dealer'
  }

  return 'tie'
}

export const outcomeMap: Record<NonNullable<Winner>, Outcome> = {
  dealer: 'loss',
  player: 'win',
  tie: 'tie',
}

export const displayScore = (score: Hand['score']) => {
  if (score.hard === score.soft || isSoftBust(score)) {
    return String(score.hard)
  }

  return `${score.soft} / ${score.hard}`
}
