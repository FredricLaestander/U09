import { useQuery } from '@tanstack/react-query'
import { createContext, use, useState, type ReactNode } from 'react'
import { draw, drawInitialCards } from '../lib/requests'
import { calculateScore, getHighestValidScore } from '../lib/score'
import type { Deck } from '../types/data'
// import type { Deck } from '../types/data'
import type { Participant, Winner } from '../types/utils'
import { useModal } from './useModal'

const GameContext = createContext<{
  dealer: Participant
  player: Participant
  winner: Winner
  stand: () => void
  hit: () => void
} | null>(null)

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { open } = useModal()

  const [deck, setDeck] = useState<Omit<Deck, 'cards'> | null>(null)
  const [dealer, setDealer] = useState<Participant | null>(null)
  const [player, setPlayer] = useState<Participant | null>(null)
  const [winner, setWinner] = useState<Winner>(null)

  const { isPending } = useQuery({
    queryKey: ['initial-cards'],
    queryFn: async () => {
      const { deck, dealer, player } = await drawInitialCards()

      setDeck(deck)
      setDealer(dealer)
      setPlayer(player)

      // a queryFn needs to return something but we won't use this
      return { success: true }
    },
    throwOnError: true,
  })

  if (isPending || !dealer || !player || !deck) {
    // TODO: create loading screen
    return null
  }

  const roundOver = (winner: NonNullable<Winner>) => {
    setWinner(winner)
    open('game-over')
  }

  const decideWinner = () => {
    const playerScore = getHighestValidScore(player.score)
    const dealerScore = getHighestValidScore(dealer.score)

    if (!playerScore) {
      return roundOver('dealer')
    }

    if (!dealerScore) {
      return roundOver('player')
    }

    if (playerScore > dealerScore) {
      return roundOver('player')
    }

    if (dealerScore > playerScore) {
      return roundOver('dealer')
    }

    roundOver('tie')
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
      roundOver('player')
    } else {
      decideWinner()
    }
  }

  const stand = () => {
    revealDealerCard()
    runDealerAction()
  }

  const hit = async () => {
    const { deck: updatedDeck, card } = await draw(deck.deck_id)

    setDeck(updatedDeck)

    const cards = [...player.cards, card]
    const score = calculateScore(cards)
    setPlayer({ cards, score })
  }

  return (
    <GameContext.Provider
      value={{
        dealer,
        player,
        winner,
        stand,
        hit,
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
