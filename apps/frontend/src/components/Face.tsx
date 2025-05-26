import type { Suit, Face as TFace } from '../types'

export const Face = ({ suit, value }: { suit: Suit; value: TFace }) => {
  return (
    <img src={`/faces/${suit}-${value}.svg`} alt={`${value} of ${suit}s`} />
  )
}
