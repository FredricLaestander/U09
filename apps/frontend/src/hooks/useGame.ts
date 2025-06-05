import { useEffect, useState } from 'react'
import { deckOfCards } from '../lib/clients/cards'
import type { Deck } from '../types/data'

export const useGame = () => {
  const [deck, setDeck] = useState<Deck | null>(null)

  useEffect(() => {
    const getCards = async () => {
      const response = await deckOfCards.get<Deck>('/new/draw', {
        params: {
          count: '4',
        },
      })
      setDeck(response.data)
    }
    getCards()
  }, [])
}
