import { Outlet } from 'react-router'
import { ToastProvider } from './components/Toaster'

export const Layout = () => {
  return (
    <ToastProvider>
      <Outlet />
    </ToastProvider>
  )
}
