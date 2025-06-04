import type { ReactNode } from 'react'
import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'

export const Protected = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    // TODO: create a loading screen
    return null
  }

  if (!user) {
    return <Navigate to="/landing" />
  }

  if (!user.username) {
    return <Navigate to="/personalize-account" />
  }

  return children
}
