import axios, { isAxiosError } from 'axios'
import { deckSchema, type User } from '../types/data'
import type { Dealer, Deck, Outcome, Player } from '../types/utils'
import { backend } from './clients/backend'
import { deckOfCards } from './clients/cards'
import { createHand } from './hand'
import { calculateScore } from './score'

type Response =
  | { success: true; error: null }
  | { success: false; error: string }

export const logOut = async () => {
  try {
    await backend.delete('/auth/log-out')
    return { success: true }
  } catch (error) {
    const message = isAxiosError(error)
      ? error.response?.data.message
      : 'something went wrong when logging out'
    return { success: false, error: message }
  }
}

export const deleteUser = async () => {
  await backend.delete('/users/me')
}

export const refreshTokens = async () => {
  // this needs to be it's own client to avoid an infinite loop with the interceptor
  await axios
    .create({
      baseURL: import.meta.env.VITE_BACKEND_URL,
      withCredentials: true,
    })
    .get('/auth/refresh-token')
}

export const getUser = async () => {
  try {
    const response = await backend.get<User>('/users/me')
    return response.data
  } catch {
    return null
  }
}

export const updateUsername = async (username: string): Promise<Response> => {
  try {
    await backend.put('/users/me', { username })
    return { success: true, error: null }
  } catch (error) {
    return handleError(error, 'Something went wrong when updating the username')
  }
}

export const updateStatistics = async (outcome: Outcome) => {
  await backend.put('/statistics', { outcome })
}

const formatDeck = (response: unknown) => {
  const { data, success } = deckSchema.safeParse(response)
  if (!success) {
    throw new Error('deck did not pass validation')
  }

  const { cards, ...deck } = {
    ...data,
    cards: data.cards.map((card) => ({
      ...card,
      id: crypto.randomUUID(),
      open: true,
    })),
  }

  return { cards, deck }
}

export const drawInitialCards = async (
  deckId?: string,
): Promise<{
  deck: Deck
  dealer: Dealer
  player: Player
}> => {
  const response = await deckOfCards.get(`/${deckId}/draw`, {
    params: { count: '4' },
  })

  const { deck, cards } = formatDeck(response.data)

  const playerCards = [cards[0], cards[2]]
  const dealerCards = [cards[1], { ...cards[3], open: false }]

  return {
    deck,
    dealer: { cards: dealerCards, score: calculateScore(dealerCards) },
    player: {
      hands: [createHand({ cards: playerCards, status: 'playing' })],
    },
  }
}

export const draw = async (deckId: string, count: number = 1) => {
  const response = await deckOfCards.get(`/${deckId}/draw`, {
    params: { count },
  })
  const { deck, cards } = formatDeck(response.data)

  return {
    deck,
    cards,
  }
}

const handleError = (
  error: unknown,
  fallback: string,
): { success: false; data: null; error: string } => {
  const message = isAxiosError(error) ? error.response?.data.message : fallback
  return { success: false, data: null, error: message }
}
