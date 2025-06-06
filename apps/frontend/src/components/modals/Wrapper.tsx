import * as Primitive from '@radix-ui/react-dialog'
import { type ReactNode } from 'react'
import { useModal, type ModalType } from '../../hooks/useModal'
import { cn } from '../../utils/classname'

export const Wrapper = ({
  children,
  type,
  classname,
}: {
  children: ReactNode
  type: ModalType
  classname?: string
}) => {
  const { isOpen, close } = useModal()

  return (
    <Primitive.Root open={isOpen(type)} onOpenChange={close}>
      <Primitive.Portal>
        <Primitive.Overlay className="fixed inset-0 z-40 bg-slate-700/80 backdrop-blur-sm" />
        <Primitive.Content
          className={cn(
            'fixed top-1/2 left-1/2 z-50 max-w-sm -translate-1/2',
            classname,
          )}
        >
          {children}
        </Primitive.Content>
      </Primitive.Portal>
    </Primitive.Root>
  )
}
