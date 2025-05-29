import { Suit } from './Suit'

export const Logo = ({ text }: { text?: boolean }) => {
  return (
    <div className="w-min">
      <div className="flex gap-1">
        <Suit variant="heart" size="lg" face />
        <Suit variant="spade" size="lg" face />
        <Suit variant="club" size="lg" face />
        <Suit variant="diamond" size="lg" face />
      </div>
      {text && (
        <span className="w-full text-4xl leading-8 font-black">
          HIT ME <br /> MAYBE
        </span>
      )}
    </div>
  )
}
