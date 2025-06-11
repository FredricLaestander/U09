import { useMutation, useQuery } from '@tanstack/react-query'
import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { useToast } from '../components/Toaster'
import { draw, drawInitialCards, updateStatistics } from '../lib/requests'
import { calculateScore, getWinner, has21, outcomeMap } from '../lib/score'
import type { Deck } from '../types/data'
import type { Participant, Winner } from '../types/utils'
import { sleep } from '../utils/sleep'
import { useModal } from './useModal'

const GameContext = createContext<{
  dealer: Participant
  player: Participant
  winner: Winner
  stand: () => void
  hit: () => void
  reset: () => Promise<void>
} | null>(null)

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { open } = useModal()
  const toast = useToast()

  const [deck, setDeck] = useState<Omit<Deck, 'cards'> | null>(null)
  const [dealer, setDealer] = useState<Participant | null>(null)
  const [player, setPlayer] = useState<Participant | null>(null)
  const [winner, setWinner] = useState<Winner>(null)
  const [turn, setTurn] = useState<'player' | 'dealer' | 'over'>('player')

  const start = async () => {
    const { deck, dealer, player } = await drawInitialCards()

    setDeck(deck)
    setDealer(dealer)
    setPlayer(player)

    if (has21(player.score)) {
      await sleep(1000)
      setTurn('dealer')
    }
  }

  const { isPending } = useQuery({
    queryKey: ['initial-cards'],
    queryFn: async () => {
      await start()
      return { success: true } // a queryFn needs to return something but we won't use this
    },
    throwOnError: true,
  })

  const { mutate: handleOutcome } = useMutation({
    mutationFn: updateStatistics,
    onError: (error) => toast.error(error.message),
  })

  useEffect(() => {
    if (!dealer || !player || !deck) return

    if (turn === 'dealer') {
      const run = async () => {
        let cards = dealer.cards.map((card) => ({ ...card, open: true }))
        let score = calculateScore(cards)

        setDealer({ cards, score })
        await sleep()

        while (score.soft < 17 || (score.soft > 21 && score.hard < 17)) {
          const { deck: updatedDeck, card } = await draw(deck.deck_id)
          setDeck(updatedDeck)

          cards = [...cards, card]
          score = calculateScore(cards)

          await sleep()
          setDealer({ cards, score: score })
        }

        await sleep(1000)
        setTurn('over')
      }
      run()
    }

    if (turn === 'over') {
      const winner = getWinner(dealer.score, player.score)
      setWinner(winner)
      handleOutcome(outcomeMap[winner])
      open('game-over')
    }
  }, [turn])

  if (isPending || !dealer || !player || !deck) {
    // TODO: create loading screen
    return null
  }

  const stand = async () => {
    setTurn('dealer')
  }

  const hit = async () => {
    const { deck: updatedDeck, card } = await draw(deck.deck_id)

    setDeck(updatedDeck)

    const cards = [...player.cards, card]
    const score = calculateScore(cards)
    setPlayer({ cards, score })

    if (has21(score)) {
      await sleep(1000)
      setTurn('dealer')
    }

    if (score.hard > 21) {
      await sleep(1000)
      setTurn('over')
    }
  }

  const reset = async () => {
    setDeck(null)
    setDealer(null)
    setPlayer(null)
    setWinner(null)
    setTurn('player')
    await start()
  }

  return (
    <GameContext.Provider
      value={{
        dealer,
        player,
        winner,
        stand,
        hit,
        reset,
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
