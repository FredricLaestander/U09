import type { Illustration as TIllustration } from '../types/utils'
import { Statistic } from './Statistic'

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
    <div className="flex flex-1 flex-col gap-2 rounded-xl bg-slate-600 p-3">
      <p className="font-bold">{name}</p>
      <Statistic illustration={illustration} value={value} />
    </div>
  )
}
