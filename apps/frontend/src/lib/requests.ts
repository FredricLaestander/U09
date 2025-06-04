import type { User } from '../types/data'
import { backend } from './clients/backend'

export const getUser = async () => {
  try {
    const response = await backend.get<User>('/users/me')
    return response.data
  } catch {
    return null
  }
}
