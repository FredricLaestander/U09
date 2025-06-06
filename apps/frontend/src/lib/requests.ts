import axios, { isAxiosError } from 'axios'
import { deckSchema, type Deck, type User } from '../types/data'
import type { Participant } from '../types/utils'
import { backend } from './clients/backend'
import { deckOfCards } from './clients/cards'

type Response =
  | { success: true; error: null }
  | { success: false; error: string }

type DataResponse<Data> =
  | { success: true; data: Data; error: null }
  | { success: false; data: null; error: string }

export const logOut = async () => {
  try {
    await backend.delete('/auth/log-out')
    return { success: true }
  } catch {
    return { success: false }
  }
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

export const drawInitialCards = async (): Promise<
  DataResponse<{
    deck: Omit<Deck, 'cards'>
    player: Participant
    dealer: Participant
  }>
> => {
  try {
    const response = await deckOfCards.get('/new/draw', {
      params: {
        count: '4',
        deck_count: '6',
      },
    })

    const { data, success } = deckSchema.safeParse(response.data)
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

    return {
      success: true,
      data: {
        deck,
        player: { cards: [cards[0], cards[2]] },
        dealer: { cards: [cards[1], { ...cards[3], open: false }] },
      },
      error: null,
    }
  } catch (error) {
    return handleError(error, 'Something went wrong when drawing the cards')
  }
}

const handleError = (
  error: unknown,
  fallback: string,
): { success: false; data: null; error: string } => {
  const message = isAxiosError(error) ? error.response?.data.message : fallback
  return { success: false, data: null, error: message }
}
