import * as Primitive from '@radix-ui/react-toast'
import { AlertCircle, type LucideIcon } from 'lucide-react'
import {
  createContext,
  use,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from 'react'

type Type = 'error'

type TToast = {
  id: string
  description: string
  type: Type
}

const ToastContext = createContext<{
  toasts: TToast[]
  setToasts: Dispatch<SetStateAction<TToast[]>>
} | null>(null)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<TToast[]>([])

  return (
    <ToastContext.Provider value={{ toasts, setToasts }}>
      {children}
      <Primitive.Provider>
        {toasts.map((toast) => (
          <Toast {...toast} key={toast.id} />
        ))}
        <Primitive.Viewport className="fixed top-12 right-4 left-4 z-50 flex flex-col gap-2 md:top-auto md:right-8 md:bottom-6 md:left-auto" />
      </Primitive.Provider>
    </ToastContext.Provider>
  )
}

const iconMap: Record<Type, LucideIcon> = {
  error: AlertCircle,
}

const Toast = ({ id, description, type }: TToast) => {
  const context = use(ToastContext)
  const Icon = iconMap[type]

  const remove = () => {
    context!.setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <Primitive.Root
      open
      onOpenChange={() => {
        remove()
      }}
      duration={3000}
      className="flex items-center gap-2 rounded-lg border border-slate-900 bg-slate-800 px-4 py-3 shadow-lg md:max-w-sm md:min-w-xs"
    >
      <Icon className="text-red" />
      <Primitive.Description className="text-sm">
        {description}
      </Primitive.Description>
    </Primitive.Root>
  )
}

export const useToast = () => {
  const context = use(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return {
    error: (description: TToast['description']) => {
      context.setToasts((prev) => [
        ...prev,
        { id: crypto.randomUUID(), description, type: 'error' },
      ])
    },
  }
}
