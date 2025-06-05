import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useToast } from '../components/Toaster'
import { getUser, logOut } from '../lib/requests'
import type { User } from '../types/data'

const AuthContext = createContext<{ user: User; logOut: () => void } | null>(
  null,
)

export const AuthProvider = ({
  children,
  check,
}: {
  children: ReactNode
  check: (user: User) => string | undefined
}) => {
  const navigate = useNavigate()
  const toast = useToast()

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getUser()
      .then((data) => {
        setUser(data)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    // TODO: create a loading screen
    return null
  }

  if (!user) {
    return <Navigate to="/landing" />
  }

  const redirectPath = check(user)
  if (redirectPath) {
    return <Navigate to={redirectPath} />
  }

  return (
    <AuthContext.Provider
      value={{
        user: user,
        logOut: async () => {
          const { success, error } = await logOut()

          if (success) {
            navigate('/landing')
          } else {
            toast.error(error)
          }
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = use(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return {
    user: context.user,
    logOut: context.logOut,
  }
}
