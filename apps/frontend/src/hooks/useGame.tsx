import { useSuspenseQuery } from '@tanstack/react-query'
import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import {
  allHandsDone,
  getPlayingHand,
  updatePlayingHand,
  updateWaitingHand,
} from '../lib/hand'
import { useUpdateStatisticsMutation } from '../lib/mutations'
import { draw, drawInitialCards } from '../lib/requests'
import {
  calculateScore,
  getWinner,
  has21,
  isHardBust,
  isSoftBust,
  outcomeMap,
} from '../lib/score'
import type { Dealer, Deck, Hand, Player, Winner } from '../types/utils'
import { sleep } from '../utils/sleep'
import { useModal } from './useModal'

const GameContext = createContext<{
  dealer: Dealer
  player: Player
  winner: Winner
  actionsDisabled: boolean
  stand: () => void
  hit: () => void
  reset: () => Promise<void>
} | null>(null)

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { open } = useModal()

  const [deck, setDeck] = useState<Deck | null>(null)
  const [dealer, setDealer] = useState<Dealer | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)

  const [winner, setWinner] = useState<Winner>(null)
  const [turn, setTurn] = useState<'player' | 'dealer' | 'over'>('player')
  const [actionsDisabled, setActionsDisabled] = useState(false)

  const { data, refetch } = useSuspenseQuery({
    queryKey: ['initial-cards'],
    queryFn: drawInitialCards,
  })

  const { mutate: handleOutcome } = useUpdateStatisticsMutation()

  useEffect(() => {
    setDeck(data.deck)
    setDealer(data.dealer)
    setPlayer(data.player)

    if (has21(data.player.hands[0].score)) {
      setActionsDisabled(true)
      sleep(1000).then(() => setTurn('dealer'))
    }
  }, [data])

  useEffect(() => {
    if (!dealer || !player || !deck) return

    if (turn === 'dealer') {
      const run = async () => {
        setActionsDisabled(true)
        await sleep(1000)

        let cards = dealer.cards.map((card) => ({ ...card, open: true }))
        let score = calculateScore(cards)

        setDealer({ cards, score })
        await sleep()

        while (score.soft < 17 || (isSoftBust(score) && score.hard < 17)) {
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
      const winners = player.hands.map((hand) =>
        getWinner(dealer.score, hand.score),
      )
      const playerWin = winners.some((winner) => winner === 'player')
      const dealerWin = winners.every((winner) => winner === 'dealer')
      const winner = playerWin ? 'player' : dealerWin ? 'dealer' : 'tie'

      setWinner(winner)
      handleOutcome(outcomeMap[winner])
      open('game-over')
    }
  }, [turn])

  const next = async (hands: Hand[], status: 'stood' | 'bust' | '21') => {
    await sleep(1000)

    const updatedPlayingHand = updatePlayingHand(hands, { status: 'done' })
    if (allHandsDone(updatedPlayingHand)) {
      setPlayer({ ...player, hands: updatedPlayingHand })

      switch (status) {
        case 'bust':
          return setTurn('over')
        case 'stood':
        case '21':
          return setTurn('dealer')
      }
    }

    const updatedWaitingHand = updateWaitingHand(updatedPlayingHand, {
      status: 'playing',
    })
    setPlayer({ ...player, hands: updatedWaitingHand })
  }

  const stand = async () => {
    await next(player!.hands, 'stood')
  }

  const hit = async () => {
    const { deck: updatedDeck, card } = await draw(deck!.deck_id)
    setDeck(updatedDeck)

    const { hand } = getPlayingHand(player!.hands)

    const cards = [...hand.cards, card]
    const score = calculateScore(cards)
    const hands = updatePlayingHand(player!.hands, { cards, score })

    setPlayer({ ...player, hands })

    if (has21(score)) {
      await next(hands, '21')
    }

    if (isHardBust(score)) {
      await next(hands, 'bust')
    }
  }

  const reset = async () => {
    setDeck(null)
    setDealer(null)
    setPlayer(null)
    setWinner(null)
    setTurn('player')
    setActionsDisabled(false)
    await refetch()
  }

  // this will never happen, it's just here to make typescript happy
  if (!dealer || !player) return null

  return (
    <GameContext.Provider
      value={{
        dealer,
        player,
        winner,
        actionsDisabled,
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
