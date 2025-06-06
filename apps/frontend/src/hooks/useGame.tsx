import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { drawInitialCards } from '../lib/requests'
// import type { Deck } from '../types/data'
import type { Participant } from '../types/utils'

const GameContext = createContext<{
  dealer: Participant
  player: Participant
} | null>(null)

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // const [deck, setDeck] = useState<Omit<Deck, 'cards'> | null>(null)
  const [dealer, setDealer] = useState<Participant | null>(null)
  const [player, setPlayer] = useState<Participant | null>(null)

  const [loading, setLoading] = useState(true)
  const isLoading = loading || !player || !dealer

  useEffect(() => {
    drawInitialCards()
      .then(({ success, data, error }) => {
        if (!success) {
          // TODO: create error boundry
          throw new Error(error)
        }

        // setDeck(data.deck)
        setPlayer(data.player)
        setDealer(data.dealer)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  if (isLoading) {
    // TODO: create loading screen
    return null
  }

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
