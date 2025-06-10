import { useQuery } from '@tanstack/react-query'
import { createContext, use, type ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useToast } from '../components/Toaster'
import { getUser, logOut } from '../lib/requests'
import type { User } from '../types/data'

const AuthContext = createContext<{ user: User; logOut: () => void } | null>(
  null,
)

export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: getUser,
  })
}

export const AuthProvider = ({
  children,
  check,
}: {
  children: ReactNode
  check: (user: User) => string | undefined
}) => {
  const navigate = useNavigate()
  const toast = useToast()

  const { data: user, isPending } = useUser()

  if (isPending) {
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
