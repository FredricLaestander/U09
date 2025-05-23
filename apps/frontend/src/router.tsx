import { createBrowserRouter } from 'react-router'
import { LandingPage } from './pages/Landing'
import { MainMenuPage } from './pages/MainMenu'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/menu',
    element: <MainMenu />,
  },
])
