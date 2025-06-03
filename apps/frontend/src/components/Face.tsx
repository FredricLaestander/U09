import type { Suit, Face as TFace } from '../types/utils'

export const Face = ({
  suit,
  value,
  classname,
}: {
  suit: Suit
  value: TFace
  classname?: string
}) => {
  return (
    <img
      src={`/faces/${suit}-${value}.svg`}
      alt={`${value} of ${suit}s`}
      className={classname}
    />
  )
}
