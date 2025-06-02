import { createBrowserRouter } from 'react-router'
import { Layout } from './layout'
import { AuthenticatePage } from './pages/Authenticate'
import { EditProfilePage } from './pages/EditProfile'
import { GamePage } from './pages/Game'
import { LandingPage } from './pages/Landing'
import { MainMenuPage } from './pages/MainMenu'
import { PersonalizeAccountPage } from './pages/PersonalizeAccount'
import { ProfilePage } from './pages/Profile'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/landing',
        element: <LandingPage />,
      },
      {
        path: '/',
        element: <MainMenuPage />,
      },
      {
        path: '/game',
        element: <GamePage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/edit-profile',
        element: <EditProfilePage />,
      },
      {
        path: '/authenticate',
        element: <AuthenticatePage />,
      },
      {
        path: '/personalize-account',
        element: <PersonalizeAccountPage />,
      },
    ],
  },
])
