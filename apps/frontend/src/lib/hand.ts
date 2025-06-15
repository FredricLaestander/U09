import type { Hand } from '../types/utils'

export const getPlayingHand = (hands: Hand[]) => {
  const condition = (hand: Hand) => hand.status === 'playing'

  return {
    hand: hands.find(condition)!,
    index: hands.findIndex(condition),
  }
}

export const updatePlayingHand = (hands: Hand[], updates: Partial<Hand>) => {
  return hands.map((hand) =>
    hand.status === 'playing' ? { ...hand, ...updates } : hand,
  )
}

export const updateWaitingHand = (hands: Hand[], updates: Partial<Hand>) => {
  const { index: playingIndex } = getPlayingHand(hands)
  return hands.map((hand, index) =>
    index === playingIndex + 1 ? { ...hand, ...updates } : hand,
  )
}

export const allHandsDone = (hands: Hand[]) => {
  return hands.every(({ status }) => status === 'done')
}
