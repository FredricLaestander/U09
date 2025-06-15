import { useSuspenseQuery } from '@tanstack/react-query'
import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import {
  addCardToHand,
  allHandsDone,
  createHand,
  getPlayingHand,
  updateHandById,
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
  canSplit: boolean
  stand: () => void
  hit: () => void
  split: () => void
  reset: () => Promise<void>
} | null>(null)

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const { open } = useModal()

  const [deck, setDeck] = useState<Deck | null>(null)
  const [dealer, setDealer] = useState<Dealer | null>(null)
  const [player, setPlayer] = useState<Player | null>(null)

  const [canSplit, setCanSplit] = useState(false)
  const [turn, setTurn] = useState<'player' | 'dealer' | 'over'>('player')
  const [winner, setWinner] = useState<Winner>(null)
  const [actionsDisabled, setActionsDisabled] = useState(false)

  const { data, refetch } = useSuspenseQuery({
    queryKey: ['initial-cards'],
    queryFn: drawInitialCards,
    refetchOnWindowFocus: false,
  })

  const { mutate: handleOutcome } = useUpdateStatisticsMutation()

  useEffect(() => {
    setDeck(data.deck)
    setDealer(data.dealer)
    setPlayer(data.player)

    const firstHand = data.player.hands[0]
    setCanSplit(firstHand.cards[0].value === firstHand.cards[1].value)

    if (has21(firstHand.score)) {
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
          const { deck: updatedDeck, cards: newCards } = await draw(
            deck.deck_id,
          )
          setDeck(updatedDeck)

          cards = [...cards, newCards[0]]
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

  const next = (hands: Hand[], status: 'stood' | 'bust' | '21') => {
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
    next(player!.hands, 'stood')
  }

  const hit = async () => {
    const { deck: updatedDeck, cards: newCards } = await draw(deck!.deck_id)
    setDeck(updatedDeck)

    const { hand } = getPlayingHand(player!.hands)

    const cards = [...hand.cards, newCards[0]]
    const score = calculateScore(cards)
    const hands = updatePlayingHand(player!.hands, { cards, score })

    setPlayer({ ...player, hands })

    if (has21(score)) {
      await sleep(1000)
      next(hands, '21')
    }

    if (isHardBust(score)) {
      await sleep(1000)
      next(hands, 'bust')
    }
  }

  const split = async () => {
    setCanSplit(false)

    const { deck: updatedDeck, cards: drawnCards } = await draw(
      deck!.deck_id,
      2,
    )
    setDeck(updatedDeck)

    const { hand } = getPlayingHand(player!.hands)
    const [firstOriginalCard, secondsOriginalCard] = hand.cards

    const firstHand = createHand({ cards: [firstOriginalCard], base: hand })
    const secondHand = createHand({ cards: [secondsOriginalCard] })

    const splitHands = [firstHand, secondHand]
    setPlayer({ ...player, hands: splitHands })

    await sleep(1000)

    const [firstDrawnCard, secondDrawnCard] = drawnCards

    const updatedFirstHand = addCardToHand({
      hand: firstHand,
      card: firstDrawnCard,
    })
    const handsAfterFirstDraw = updatePlayingHand(splitHands, updatedFirstHand)
    setPlayer({ ...player, hands: handsAfterFirstDraw })

    await sleep(1000)

    const updatedSecondHand = addCardToHand({
      hand: secondHand,
      card: secondDrawnCard,
    })
    const finalHands = updateHandById({
      hands: handsAfterFirstDraw,
      id: updatedSecondHand.id,
      updates: updatedSecondHand,
    })

    setPlayer({ ...player, hands: finalHands })
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
        canSplit,
        actionsDisabled,
        stand,
        hit,
        split,
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
