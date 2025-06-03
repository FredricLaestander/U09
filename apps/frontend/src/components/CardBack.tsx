import { cn } from '../utils/classname'

export const CardBack = ({
  size,
  classname,
}: {
  size: 'sm' | 'md'
  classname?: string
}) => {
  return (
    <div
      className={cn(
        'aspect-[2/3] shrink-0 bg-slate-50 shadow-lg',
        size === 'md' && 'w-32 rounded-lg p-1.5 md:w-40 md:rounded-xl md:p-2',
        size === 'sm' &&
          'w-28 rounded-lg p-1.25 md:w-36 md:rounded-xl md:p-1.5',
        classname,
      )}
    >
      <img
        src="/pattern.jpg"
        alt="card back"
        className="rounded-xs md:rounded-sm"
      />
    </div>
  )
}
