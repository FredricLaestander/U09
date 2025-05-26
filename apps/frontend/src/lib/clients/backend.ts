import axios from 'axios'

export const backend = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: { 'Content-Type': 'application/json' },
})
