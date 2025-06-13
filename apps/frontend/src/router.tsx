import { createBrowserRouter } from 'react-router'
import { Protected } from './components/Protected'
import { AuthProvider } from './hooks/useAuth'
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
        element: (
          <Protected>
            <MainMenuPage />
          </Protected>
        ),
      },
      {
        path: '/game',
        element: (
          <Protected>
            <GamePage />
          </Protected>
        ),
      },
      {
        path: '/profile',
        element: (
          <Protected>
            <ProfilePage />
          </Protected>
        ),
      },
      {
        path: '/edit-profile',
        element: (
          <Protected>
            <EditProfilePage />
          </Protected>
        ),
      },
      {
        path: '/authenticate',
        element: <AuthenticatePage />,
      },
      {
        path: '/personalize-account',
        element: (
          <AuthProvider
            check={(user) => {
              if (user.username) {
                return '/'
              }
            }}
          >
            <PersonalizeAccountPage />
          </AuthProvider>
        ),
      },
    ],
  },
])
