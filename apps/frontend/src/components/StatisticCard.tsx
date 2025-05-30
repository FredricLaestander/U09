import type { Illustration as TIllustration } from '../types'
import { Statistic } from './statistic'

export const StatisticCard = ({
  name,
  illustration,
  value,
}: {
  name: string
  illustration: TIllustration
  value: string
}) => {
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-slate-600 p-3">
      <p className="font-bold">{name}</p>
      <Statistic illustration={illustration} value={value} />
    </div>
  )
}
