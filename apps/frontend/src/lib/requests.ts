import axios, { isAxiosError } from 'axios'
import type { User } from '../types/data'
import { backend } from './clients/backend'

export const logOut = async () => {
  try {
    await backend.delete('/auth/log-out')
    return { success: true }
  } catch {
    return { success: false }
  }
}

export const refreshTokens = async () => {
  // this needs to be it's own client to avoid an infinite loop with the interceptor
  await axios
    .create({
      baseURL: import.meta.env.VITE_BACKEND_URL,
      withCredentials: true,
    })
    .get('/auth/refresh-token')
}

export const getUser = async () => {
  try {
    const response = await backend.get<User>('/users/me')
    return response.data
  } catch {
    return null
  }
}

export const updateUsername = async (username: string) => {
  try {
    await backend.put('/users/me', { username })
    return { success: true }
  } catch (error) {
    const message = isAxiosError(error)
      ? error.response?.data.message
      : 'something went wrong when updating the username'
    return { success: false, error: message }
  }
}
