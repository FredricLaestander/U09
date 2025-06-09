import { Outlet } from 'react-router'
import { ToastProvider } from './components/Toaster'
import { ModalProvider } from './hooks/useModal'
import { TanstackProvider } from './providers/QueryClientProvider'

export const Layout = () => {
  return (
    <TanstackProvider>
      <ToastProvider>
        <ModalProvider>
          <Outlet />
        </ModalProvider>
      </ToastProvider>
    </TanstackProvider>
  )
}
