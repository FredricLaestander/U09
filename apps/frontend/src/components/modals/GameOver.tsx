import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog'
import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { useGame } from '../../hooks/useGame'
import { useModal } from '../../hooks/useModal'
import type { Winner } from '../../types/utils'
import { Button } from '../Button'
import { StatisticCard } from '../StatisticCard'
import { Wrapper } from './Wrapper'

const getTitle = (winner: Winner) => {
  if (!winner) return 'Game over'

  switch (winner) {
    case 'dealer':
      return 'You lost...'
    case 'player':
      return 'You won!'
    case 'tie':
      return 'You tied with the dealer.'
  }
}

export const GameOver = () => {
  const { winner, reset } = useGame()
  const { close } = useModal()
  const { user } = useAuth()

  return (
    <Wrapper type="game-over" classname="w-full flex flex-col px-4 sm:p-0">
      <DialogTitle className="text-center text-2xl font-black">
        {getTitle(winner)}
      </DialogTitle>
      <DialogDescription className="sr-only">
        Play again or quit to the main menu
      </DialogDescription>

      <div className="mt-6 flex gap-6">
        <StatisticCard
          name="Streak"
          illustration="fire"
          value={String(user.statistics.streak)}
        />
        <StatisticCard
          name="Wins"
          illustration="crown"
          value={String(user.statistics.wins)}
        />
        <StatisticCard
          name="Losses"
          illustration="cloud"
          value={String(user.statistics.losses)}
        />
      </div>

      <div className="mt-8 flex w-full gap-3">
        <Button
          onClick={() => {
            reset()
            close()
          }}
          variant="blue"
          className="flex-1"
        >
          Play again
        </Button>
        <Button as={Link} to="/">
          Quit
        </Button>
      </div>
    </Wrapper>
  )
}
