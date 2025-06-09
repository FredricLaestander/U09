import { useEffect, useState } from 'react'
import { drawInitialCards } from '../lib/requests'
// import type { Deck } from '../types/data'
import type { Participant } from '../types/utils'

export const useGame = () => {
  // const [deck, setDeck] = useState<Omit<Deck, 'cards'> | null>(null)
  const [dealer, setDealer] = useState<Participant | null>(null)
  const [player, setPlayer] = useState<Participant | null>(null)

  useEffect(() => {
    const getCards = async () => {
      const { success, data, error } = await drawInitialCards()

      if (!success) {
        // TODO: handle error
        console.log(error)
        return
      }

      // setDeck(data.deck)
      setPlayer(data.player)
      setDealer(data.dealer)
    }
    getCards()
  }, [])

  return { player, dealer }
}
