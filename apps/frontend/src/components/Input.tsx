import type { InputHTMLAttributes } from 'react'
import { cn } from '../utils/classname'

export const Input = ({
  label,
  error,
  ...props
}: {
  label: string
  error: string | null
} & InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-1">
      <div
        className={cn(
          'relative flex w-full items-center gap-2 rounded-lg border border-transparent bg-slate-600 px-4 py-2 text-slate-50 outline-none has-focus-visible:border-blue',
          error && 'border-red',
        )}
      >
        <input
          {...props}
          placeholder={label}
          className="peer w-full outline-0 placeholder:text-transparent"
        />

        <label
          htmlFor={props.id}
          className={cn(
            'absolute -top-4 left-2 cursor-text text-xs text-slate-300 transition-all',
            'peer-focus-visible:-top-4 peer-focus-visible:left-2 peer-focus-visible:text-xs peer-focus-visible:text-blue',
            'peer-placeholder-shown:top-2 peer-placeholder-shown:left-4 peer-placeholder-shown:text-base',
          )}
        >
          {label}
        </label>
      </div>
      {error && <span className="text-sm text-red">{error}</span>}
    </div>
  )
}
