import type { Suit as TSuit } from '../types/utils'
import { cn } from '../utils/classname'
import { Face } from './Face'
import { Suit } from './Suit'

type Number = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
type Value = Number | 'J' | 'Q' | 'K' | 'A'
type Scale = '100' | '90' | '80' | '70'

type Card = {
  suit: TSuit
  value: Value
}

const colorMap: Record<TSuit, string> = {
  club: 'text-blue',
  spade: 'text-blue',
  heart: 'text-red',
  diamond: 'text-red',
}

export const CardFront = ({
  suit,
  value,
  scale = '100',
}: Card & { scale?: Scale }) => {
  const color = colorMap[suit]

  return (
    <div
      className={cn(
        'flex aspect-[2/3] shrink-0 flex-col items-center justify-between overflow-hidden bg-slate-50 shadow-lg',
        scale === '100' && 'w-40 rounded-xl p-3',
        scale === '90' && 'p w-36 rounded-xl p-2.5',
        scale === '80' && 'w-32 rounded-lg p-2',
        scale === '70' && 'w-28 rounded-lg p-2',
      )}
    >
      <Symbol
        suit={suit}
        value={value}
        color={color}
        direction="up"
        scale={scale}
      />
      <Art suit={suit} value={value} scale={scale} />
      <Symbol
        suit={suit}
        value={value}
        color={color}
        direction="down"
        scale={scale}
      />
    </div>
  )
}

const Symbol = ({
  suit,
  value,
  color,
  direction,
  scale,
}: Card & { color: string; direction: 'up' | 'down'; scale: Scale }) => {
  return (
    <div
      className={cn(
        'flex flex-col items-center',
        direction === 'up' && 'self-start',
        direction === 'down' && 'rotate-180 self-end',
      )}
    >
      <span
        className={cn(
          'font-black',
          scale === '100' && 'text-lg/tight',
          scale === '90' && 'text-base/tight',
          scale === '80' && 'text-sm/tight',
          scale === '70' && 'text-xs/tight',
          color,
        )}
      >
        {value}
      </span>
      <Suit
        variant={suit}
        size="sm"
        classname={cn(
          scale === '100' && 'w-4',
          scale === '90' && 'w-4',
          scale === '80' && 'w-3',
          scale === '70' && 'w-3',
        )}
      />
    </div>
  )
}

const placement: Record<Number, string[]> = {
  2: ['row-2 col-2', 'row-4 col-2'],
  3: ['row-1 col-2', 'row-3 col-2', 'row-5 col-2'],
  4: ['row-2 col-1', 'row-2 col-3', 'row-4 col-1', 'row-4 col-3'],
  5: [
    'row-1 col-1',
    'row-1 col-3',
    'row-3 col-2',
    'row-5 col-1',
    'row-5 col-3',
  ],
  6: [
    'row-1 col-1',
    'row-1 col-3',
    'row-3 col-1',
    'row-3 col-3',
    'row-5 col-1',
    'row-5 col-3',
  ],
  7: [
    'row-1 col-1',
    'row-1 col-3',
    'row-2 col-2',
    'row-3 col-1',
    'row-3 col-3',
    'row-5 col-1',
    'row-5 col-3',
  ],
  8: [
    'row-1 col-1',
    'row-1 col-3',
    'row-2 col-2',
    'row-3 col-1',
    'row-3 col-3',
    'row-4 col-2',
    'row-5 col-1',
    'row-5 col-3',
  ],
  9: [
    'row-1 col-1',
    'row-1 col-3',
    'row-3 col-1',
    'row-3 col-3',
    'row-4 col-2',
    'row-5 col-1',
    'row-5 col-3',
    'row-7 col-1',
    'row-7 col-3',
  ],
  10: [
    'row-1 col-1',
    'row-1 col-3',
    'row-2 col-2',
    'row-3 col-1',
    'row-3 col-3',
    'row-5 col-1',
    'row-5 col-3',
    'row-6 col-2',
    'row-7 col-1',
    'row-7 col-3',
  ],
}

const getFace = ({ suit, value, classname }: Card & { classname: string }) => {
  switch (value) {
    case 'J':
      return <Face suit={suit} value="jack" classname={classname} />
    case 'Q':
      return <Face suit={suit} value="queen" classname={classname} />
    case 'K':
      return <Face suit={suit} value="king" classname={classname} />
    case 'A':
      return <Suit variant={suit} size="lg" face classname={classname} />
  }
}

const Art = ({ suit, value, scale }: Card & { scale: Scale }) => {
  const number = Number(value)

  if (isNaN(number)) {
    const classname = cn(
      scale === '90' && 'w-18',
      scale === '80' && 'w-16',
      scale === '70' && 'w-14',
    )

    return (
      <div className="flex w-full grow items-center justify-center">
        {getFace({ suit, value, classname })}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'grid aspect-[2/3] h-min flex-1 grid-cols-3 place-items-center',
        number < 9 && 'grid-rows-5',
        number >= 9 && 'grid-rows-7',
      )}
    >
      {Array.from({ length: number }, (_, i) => i).map((index) => (
        <Suit
          key={index}
          variant={suit}
          size="lg"
          classname={placement[value as Number][index]}
        />
      ))}
    </div>
  )
}
