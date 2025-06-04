import axios from 'axios'
import { refreshTokens } from '../requests'

export const backend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

const authErrorCodes = [401, 403]

backend.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config

    if (authErrorCodes.includes(error.response.status) && !config._retry) {
      config._retry = true

      try {
        await refreshTokens()
        return backend(config)
      } catch (refreshError) {
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)
