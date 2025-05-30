import { Illustration } from './Illustration'

export const Statistic = ({
  illustration,
  value,
}: {
  illustration: 'fire' | 'crown' | 'cloud'
  value: string
}) => {
  return (
    <div className="flex gap-1">
      <Illustration variant={illustration} />
      <span>{value}</span>
    </div>
  )
}
