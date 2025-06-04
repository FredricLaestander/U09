import { useEffect, useState } from 'react'
import { getUser } from '../lib/requests'
import type { User } from '../types/data'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getUser().then((data) => {
      setUser(data)
      setIsLoading(false)
    })
  }, [])

  return { user, isLoading }
}
