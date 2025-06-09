import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { drawInitialCards } from '../lib/requests'
// import type { Deck } from '../types/data'
import type { Participant } from '../types/utils'

const GameContext = createContext<{
  dealer: Participant | null
  player: Participant | null
} | null>(null)

export const GameProvider = ({ children }: { children: ReactNode }) => {
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

  return (
    <GameContext.Provider
      value={{
        dealer,
        player,
      }}
    >
      {children}
    </GameContext.Provider>
  )
}

export const useGame = () => {
  const context = use(GameContext)
  if (!context) {
    throw new Error('useGame must be used within a GameProvider')
  }

  return context
}
