import { createBrowserRouter } from 'react-router'
import { Layout } from './layout'
import { EditProfilePage } from './pages/EditProfile'
import { GamePage } from './pages/Game'
import { LandingPage } from './pages/Landing'
import { LogInPage } from './pages/LogIn'
import { MainMenuPage } from './pages/MainMenu'
import { PersonalizeAccountPage } from './pages/PersonalizeAccount'
import { ProfilePage } from './pages/Profile'
import { RegisterPage } from './pages/Register'

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
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/personalize-account',
        element: <PersonalizeAccountPage />,
      },
      {
        path: '/log-in',
        element: <LogInPage />,
      },
    ],
  },
])
