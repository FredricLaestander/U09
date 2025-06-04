import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { useToast } from '../components/Toaster'
import { getUser, logOut } from '../lib/requests'
import type { User } from '../types/data'

export const useAuth = () => {
  const navigate = useNavigate()
  const toast = useToast()

  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getUser().then((data) => {
      setUser(data)
      setIsLoading(false)
    })
  }, [])

  return {
    user,
    isLoading,
    logOut: async () => {
      const { success } = await logOut()
      if (success) {
        navigate('/landing')
      } else {
        toast.error('Could not log out')
      }
    },
  }
}
