import type { ReactNode } from 'react'
import { AuthProvider } from '../hooks/useAuth'

export const Protected = ({ children }: { children: ReactNode }) => {
  return (
    <AuthProvider
      check={(user) => {
        if (!user.username) {
          return '/personalize-account'
        }
      }}
    >
      {children}
    </AuthProvider>
  )
}
