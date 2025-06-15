import { Plus, X } from 'lucide-react'
import { Suspense } from 'react'
import { Button } from '../components/Button'
import { CardBack } from '../components/CardBack'
import { CardFront } from '../components/CardFront'
import { Count } from '../components/Count'
import { Header } from '../components/Header'
import { GameMenu } from '../components/modals/GameMenu'
import { GameOver } from '../components/modals/GameOver'
import { Skeleton } from '../components/Skeleton'
import { Statistic } from '../components/Statistic'
import { useAuth } from '../hooks/useAuth'
import { GameProvider, useGame } from '../hooks/useGame'
import { useModal } from '../hooks/useModal'
import { displayScore } from '../lib/score'
import { cn } from '../utils/classname'

export const GamePage = () => {
  return (
    <>
      <GameHeader />
      <Suspense
        fallback={
          <main className="flex w-full grow flex-col items-center px-4 pb-4 md:pb-8">
            <div className="flex grow flex-col items-center justify-between pt-[12vh] md:pt-8">
              <DealerHandSkeleton />
              <PlayerHandSkeleton />
            </div>
            <ActionsSkeleton />
          </main>
        }
      >
        <GameProvider>
          <main className="flex w-full grow flex-col items-center px-4 pb-4 md:pb-8">
            <div className="flex grow flex-col items-center justify-between pt-[12vh] md:pt-8">
              <DealerHand />
              <PlayerHand />
            </div>
            <Actions />
          </main>
          <GameMenu />
          <GameOver />
        </GameProvider>
      </Suspense>
    </>
  )
}

const GameHeader = () => {
  const { user } = useAuth()
  const { open } = useModal()

  return (
    <Header>
      <Button onClick={() => open('game-menu')} size="sm">
        Menu
      </Button>
      {user.statistics.streak > 1 && (
        <Statistic illustration="fire" value={String(user.statistics.streak)} />
      )}
    </Header>
  )
}

const DealerHand = () => {
  const { dealer } = useGame()

  return (
    <section className="flex flex-col items-center gap-4">
      <div className="flex gap-3">
        {dealer.cards.map(({ id, open, suit, value }) => {
          if (open) {
            return <CardFront key={id} suit={suit} value={value} size="sm" />
          } else {
            return <CardBack key={id} size="sm" />
          }
        })}
      </div>

      <Count value={displayScore(dealer.score)} />
    </section>
  )
}
const DealerHandSkeleton = () => {
  return (
    <div className="flex gap-3">
      <Skeleton classname="w-28 aspect-[2/3] rounded-lg md:w-36 md:rounded-xl" />
      <Skeleton classname="w-28 aspect-[2/3] rounded-lg md:w-36 md:rounded-xl" />
    </div>
  )
}

const PlayerHand = () => {
  const { player } = useGame()

  return (
    <section
      style={{
        gridTemplateColumns: Array(player.cards.length)
          .fill('min-content')
          .join(' '),
      }}
      className="relative grid pb-6 md:pb-0"
    >
      {player.cards.map(({ id, suit, value }, index) => (
        <CardFront
          key={id}
          suit={suit}
          value={value}
          style={{
            gridColumn: `${index + 1} / ${index + 3}`,
          }}
          classname={cn(
            'row-1',
            index % 2 === 0 && '-rotate-2',
            index % 2 === 1 && 'rotate-2',
          )}
          size="md"
        />
      ))}
      <Count
        value={displayScore(player.score)}
        classname="absolute top-4 left-[calc(100%_-_2rem)]"
      />
    </section>
  )
}
const PlayerHandSkeleton = () => {
  return (
    <div className="grid grid-cols-[min-content_min-content] pb-6 md:pb-0">
      <Skeleton classname="w-32 col-start-1 col-end-3 aspect-[2/3] rounded-lg md:w-40 md:rounded-xl row-1 -rotate-2" />
      <Skeleton classname="w-32 col-start-2 col-end-4 aspect-[2/3] rounded-lg md:w-40 md:rounded-xl row-1 rotate-2" />
    </div>
  )
}

const Actions = () => {
  const { stand, hit } = useGame()

  return (
    <nav className="flex w-full max-w-sm flex-col gap-3 md:absolute md:top-1/2 md:left-1/2 md:-translate-1/2">
      <Button
        variant="blue"
        size="sm"
        className="top-1/2 -translate-y-1/2 self-end md:absolute md:left-[calc(100%_+_0.75rem)]"
      >
        Split
      </Button>

      <div className="flex gap-3">
        <Button
          onClick={hit}
          variant="green"
          icon={Plus}
          className="flex-1 md:w-36"
        >
          Hit
        </Button>
        <Button
          onClick={stand}
          variant="red"
          icon={X}
          className="flex-1 md:w-36"
        >
          Stand
        </Button>
      </div>
    </nav>
  )
}
const ActionsSkeleton = () => {
  return (
    <nav className="flex w-full max-w-sm flex-col gap-3 md:absolute md:top-1/2 md:left-1/2 md:-translate-1/2">
      <Button
        size="sm"
        className="top-1/2 -translate-y-1/2 self-end md:absolute md:left-[calc(100%_+_0.75rem)]"
        disabled
      >
        Split
      </Button>

      <div className="flex gap-3">
        <Button icon={Plus} className="flex-1 md:w-36" disabled>
          Hit
        </Button>
        <Button icon={X} className="flex-1 md:w-36" disabled>
          Stand
        </Button>
      </div>
    </nav>
  )
}
