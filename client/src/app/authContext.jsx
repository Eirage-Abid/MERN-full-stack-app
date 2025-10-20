import React, { createContext, useContext, useState, useEffect } from 'react'
import { api, setAccessToken as setAxiosToken } from './axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  // Login method
  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAxiosToken(data.access)
      setAccessToken(data.access)
      setUser(data.user)
      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { success: true, data }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, error }
    }
  }

  // Signup method
  const signup = async (name, email, password) => {
    try {
      console.log('Attempting signup with:', { name, email })
      const { data } = await api.post('/auth/signup', { name, email, password })
      console.log('Signup successful:', data)
      setAxiosToken(data.access)
      setAccessToken(data.access)
      setUser(data.user)
      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('user', JSON.stringify(data.user))
      return { success: true, data }
    } catch (error) {
      console.error('Signup failed:', error)
      console.error('Error details:', error.response?.data)
      return { success: false, error }
    }
  }

  // Logout method
  const logout = () => {
    setAxiosToken(null)
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  // Check for existing authentication on app load
  useEffect(() => {
    const storedToken = localStorage.getItem('accessToken')
    const storedUser = localStorage.getItem('user')
    if (storedToken && storedUser) {
      setAxiosToken(storedToken)
      setAccessToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
  }, [])

  return (
    <AuthContext.Provider value={{ user, accessToken, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
