import { useEffect, useState } from 'react'
import { backend } from '../lib/clients/backend'
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

const getUser = async () => {
  try {
    const response = await backend.get<User>('/users/me')
    return response.data
  } catch {
    return null
  }
}
