import { Plus, X } from 'lucide-react'
import { Button } from '../components/Button'
import { CardBack } from '../components/CardBack'
import { CardFront } from '../components/CardFront'
import { Count } from '../components/Count'
import { Statistic } from '../components/Statistic'

export const GamePage = () => {
  return (
    <main className="flex w-full grow flex-col items-center px-4 pt-6 pb-4 md:p-8">
      <header className="absolute inset-x-0 flex items-center justify-between px-4 md:px-8">
        <Button size="sm">Menu</Button>
        <Statistic illustration="fire" value="3" />
      </header>

      <div className="flex grow flex-col items-center justify-between">
        <section className="flex flex-col items-center gap-4 pt-[8vh] md:pt-0">
          <div className="flex gap-3">
            <CardFront suit="diamond" value="J" size="sm" />
            <CardBack size="sm" />
          </div>

          <Count value="10" />
        </section>

        <section className="relative grid grid-cols-[min-content_4rem_min-content] pb-6 md:pb-0">
          <CardFront
            suit="diamond"
            value="A"
            classname="-rotate-2 col-start-1 col-end-3 justify-self-end row-1"
            size="md"
          />
          <CardFront
            suit="club"
            value="4"
            classname="rotate-2 col-start-2 col-end-4 row-1"
            size="md"
          />
          <Count
            value="15/5"
            classname="absolute top-4 left-[calc(100%_-_2rem)]"
          />
        </section>
      </div>

      <nav className="flex w-full max-w-sm flex-col gap-3 md:absolute md:top-1/2 md:left-1/2 md:-translate-1/2">
        <Button
          variant="blue"
          size="sm"
          className="self-end md:absolute md:left-[calc(100%_+_0.75rem)]"
        >
          Split
        </Button>

        <div className="flex gap-3">
          <Button variant="green" icon={Plus} className="flex-1 md:w-36">
            Hit
          </Button>
          <Button variant="red" icon={X} className="flex-1 md:w-36">
            Stand
          </Button>
        </div>
      </nav>
    </main>
  )
}
