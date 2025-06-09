import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { drawInitialCards } from '../lib/requests'
// import type { Deck } from '../types/data'
import type { Participant } from '../types/utils'

type Winner = 'dealer' | 'player' | 'tie' | null

const GameContext = createContext<{
  dealer: Participant
  player: Participant
  winner: Winner
  stand: () => void
} | null>(null)

export const GameProvider = ({ children }: { children: ReactNode }) => {
  // const [deck, setDeck] = useState<Omit<Deck, 'cards'> | null>(null)
  const [dealer, setDealer] = useState<Participant | null>(null)
  const [player, setPlayer] = useState<Participant | null>(null)
  const [winner, setWinner] = useState<Winner>(null)

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

  const getHighestValidScore = (score: Participant['score']) => {
    if (score.soft < 21) {
      return score.soft
    }

    if (score.hard < 21) {
      return score.hard
    }

    return null
  }

  const decideWinner = () => {
    const playerScore = getHighestValidScore(player.score)
    const dealerScore = getHighestValidScore(dealer.score)

    if (!playerScore) {
      return setWinner('dealer')
    }

    if (!dealerScore) {
      return setWinner('player')
    }

    if (playerScore > dealerScore) {
      return setWinner('player')
    }

    if (dealerScore > playerScore) {
      return setWinner('dealer')
    }

    setWinner('tie')
  }

  const revealDealerCard = () => {
    const cards = dealer.cards.map((card) => ({ ...card, open: true }))
    setDealer({ ...dealer, cards })
  }

  const runDealerAction = () => {
    const score = dealer.score

    if (score.soft < 17) {
      // TODO: draw new card for the dealer
    } else if (score.hard > 21) {
      setWinner('player')
    } else {
      decideWinner()
    }
  }

  const stand = () => {
    revealDealerCard()
    runDealerAction()
  }

  return (
    <GameContext.Provider
      value={{
        dealer,
        player,
        winner,
        stand,
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
