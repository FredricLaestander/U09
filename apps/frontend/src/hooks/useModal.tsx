import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router'
import { Modals } from '../components/modals/Modals'

export type ModalType = 'game-menu' | 'game-over'

const ModalContext = createContext<{
  type: ModalType | null
  open: (type: ModalType) => void
  close: () => void
} | null>(null)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const pathname = useLocation().pathname
  const [type, setType] = useState<ModalType | null>(null)

  const open = (type: ModalType) => {
    setType(type)
  }

  const close = () => {
    setType(null)
  }

  useEffect(() => {
    close()
  }, [pathname])

  return (
    <ModalContext.Provider
      value={{
        type,
        open,
        close,
      }}
    >
      {children}
      <Modals />
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = use(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }

  return {
    open: context.open,
    close: context.close,
    isOpen: (type: ModalType) => {
      return context.type === type
    },
  }
}
