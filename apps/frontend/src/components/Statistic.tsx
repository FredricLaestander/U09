import type { Illustration as TIllustration } from '../types'
import { Illustration } from './Illustration'

export const Statistic = ({
  illustration,
  value,
}: {
  illustration: TIllustration
  value: string
}) => {
  return (
    <div className="flex gap-1">
      <Illustration variant={illustration} />
      <span>{value}</span>
    </div>
  )
}
