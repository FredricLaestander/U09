import { cn } from '../utils/classname'
import { Suit } from './Suit'

export const Logo = ({
  text,
  size = 'md',
  classname,
}: {
  text?: boolean
  size?: 'md' | 'lg'
  classname?: string
}) => {
  const suitSize = text ? 'lg' : 'md'

  return (
    <div className={cn(text && 'w-min', classname)}>
      <div className={cn('flex gap-1', !text && '*:shrink-0')}>
        <Suit variant="heart" size={suitSize} face />
        <Suit variant="spade" size={suitSize} face />
        <Suit variant="club" size={suitSize} face />
        <Suit variant="diamond" size={suitSize} face />
      </div>
      {text && (
        <span
          className={cn(
            'w-full font-black',
            size === 'md' && 'text-4xl leading-8',
            size === 'lg' && 'text-7xl leading-14',
          )}
        >
          HIT ME <br /> MAYBE
        </span>
      )}
    </div>
  )
}
