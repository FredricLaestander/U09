import type { Suit as TSuit } from '../types/utils'
import { cn } from '../utils/classname'
import { Face } from './Face'
import { Suit } from './Suit'

type Number = '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10'
type Value = Number | 'J' | 'Q' | 'K' | 'A'
type Size = 'sm' | 'md'

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
  size,
  classname,
}: Card & { size: Size; classname?: string }) => {
  const color = colorMap[suit]

  return (
    <div
      className={cn(
        'flex aspect-[2/3] shrink-0 flex-col items-center justify-between overflow-hidden bg-slate-50 shadow-lg',
        size === 'md' && 'w-32 rounded-lg p-2 md:w-40 md:rounded-xl md:p-3',
        size === 'sm' && 'w-28 rounded-lg p-2 md:w-36 md:rounded-xl md:p-2.5',
        classname,
      )}
    >
      <Symbol
        suit={suit}
        value={value}
        color={color}
        direction="up"
        size={size}
      />
      <Art suit={suit} value={value} size={size} />
      <Symbol
        suit={suit}
        value={value}
        color={color}
        direction="down"
        size={size}
      />
    </div>
  )
}

const Symbol = ({
  suit,
  value,
  color,
  direction,
  size,
}: Card & { color: string; direction: 'up' | 'down'; size: Size }) => {
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
          size === 'md' && 'text-sm/tight md:text-lg/tight',
          size === 'sm' && 'text-xs/tight md:text-base/tight',
          color,
        )}
      >
        {value}
      </span>
      <Suit variant={suit} size="sm" classname="w-3 md:w-4" />
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

const Art = ({ suit, value, size }: Card & { size: Size }) => {
  const number = Number(value)

  if (isNaN(number)) {
    const classname = cn(
      size === 'md' && 'w-16 md:w-full',
      size === 'sm' && 'w-14 md:w-18',
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
