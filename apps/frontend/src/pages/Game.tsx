import { Plus, X } from 'lucide-react'
import { Button } from '../components/Button'
import { CardBack } from '../components/CardBack'
import { CardFront } from '../components/CardFront'
import { Count } from '../components/Count'
import { Statistic } from '../components/Statistic'

export const GamePage = () => {
  return (
    <main className="flex w-full grow p-8">
      <header className="absolute inset-x-0 flex items-center justify-between px-8">
        <Button size="sm">Menu</Button>
        <Statistic illustration="fire" value="3" />
      </header>

      <div className="flex grow flex-col items-center justify-between">
        <section className="flex flex-col items-center gap-4">
          <div className="flex gap-3">
            <CardFront suit="diamond" value="J" scale="90" />
            <CardBack scale="90" />
          </div>

          <Count value="10" />
        </section>

        <section className="relative grid grid-cols-[min-content_4rem_min-content]">
          <CardFront
            suit="diamond"
            value="A"
            classname="-rotate-2 col-start-1 col-end-3 justify-self-end row-1"
          />
          <CardFront
            suit="club"
            value="4"
            classname="rotate-2 col-start-2 col-end-4 row-1"
          />
          <Count
            value="15/5"
            classname="absolute top-4 left-[calc(100%_-_2rem)]"
          />
        </section>
      </div>

      <nav className="absolute top-1/2 left-1/2 flex -translate-1/2 items-center gap-3">
        <Button variant="green" icon={Plus} className="w-36">
          Hit
        </Button>
        <Button variant="red" icon={X} className="w-36">
          Stand
        </Button>
        <Button
          variant="blue"
          size="sm"
          className="absolute left-[calc(100%_+_0.75rem)]"
        >
          Split
        </Button>
      </nav>
    </main>
  )
}
