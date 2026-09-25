import axios, { AxiosError } from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? ''

export const api = axios.create({
  baseURL: `${baseURL}/api`,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pc_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('pc_token')
      localStorage.removeItem('pc_user')
      if (window.location.pathname !== '/login') {
        window.location.replace('/login')
      }
    }
    return Promise.reject(error)
  },
)