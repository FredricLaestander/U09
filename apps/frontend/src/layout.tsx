import { Outlet } from 'react-router'
import { ToastProvider } from './components/Toaster'
import { ModalProvider } from './hooks/useModal'

export const Layout = () => {
  return (
    <ToastProvider>
      <ModalProvider>
        <Outlet />
      </ModalProvider>
    </ToastProvider>
  )
}
