import type { Card, Hand, Status } from '../types/utils'
import { calculateScore } from './score'

export const createHand = ({
  cards,
  base,
  status,
}: {
  cards: Card[]
  base?: Hand
  status?: Status
}): Hand => {
  return {
    ...(base || {}),
    id: base?.id || crypto.randomUUID(),
    cards,
    score: calculateScore(cards),
    status: status || base?.status || 'waiting',
  }
}

export const getPlayingHand = (hands: Hand[]) => {
  const condition = (hand: Hand) => hand.status === 'playing'

  return {
    hand: hands.find(condition)!,
    index: hands.findIndex(condition),
  }
}

export const addCardToHand = ({
  hand,
  card,
}: {
  hand: Hand
  card: Card
}): Hand => {
  const cards = [...hand.cards, card]
  return {
    ...hand,
    cards,
    score: calculateScore(cards),
  }
}

export const updateHandById = ({
  hands,
  id,
  updates,
}: {
  hands: Hand[]
  id: string
  updates: Partial<Hand>
}) => {
  return hands.map((hand) => (hand.id === id ? { ...hand, ...updates } : hand))
}

export const updatePlayingHand = (hands: Hand[], updates: Partial<Hand>) => {
  return hands.map((hand) =>
    hand.status === 'playing' ? { ...hand, ...updates } : hand,
  )
}

export const updateWaitingHand = (hands: Hand[], updates: Partial<Hand>) => {
  const waitingIndex = hands.findIndex(({ status }) => status === 'waiting')
  return hands.map((hand, index) =>
    index === waitingIndex ? { ...hand, ...updates } : hand,
  )
}

export const allHandsDone = (hands: Hand[]) => {
  return hands.every(({ status }) => status === 'done')
}
