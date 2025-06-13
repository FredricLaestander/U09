import { cn } from '../utils/classname'

export const Skeleton = ({ classname }: { classname?: string }) => {
  return <div className={cn('animate-pulse bg-slate-600', classname)} />
}
