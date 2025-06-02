import { createContext, use, useState, type ReactNode } from 'react'
import { Modals } from '../components/modals/Modals'

export type ModalType = 'game-menu' | 'game-over'

const ModalContext = createContext<{
  type: ModalType | null
  open: (type: ModalType) => void
  close: () => void
} | null>(null)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [type, setType] = useState<ModalType | null>(null)

  return (
    <ModalContext.Provider
      value={{
        type,
        open: (type) => {
          setType(type)
        },
        close: () => {
          setType(null)
        },
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
