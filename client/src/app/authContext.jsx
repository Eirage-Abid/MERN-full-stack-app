import React, { createContext, useContext, useState } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [accessToken, setAccessToken] = useState(null)

  // Login method
  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:4000/api/auth/login', { email, password })
      setAccessToken(data.access)
      setUser(data.user)
      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      console.error('Login failed:', error)
    }
  }

  // Signup method
  const signup = async (name, email, password) => {
    try {
      const { data } = await axios.post('http://localhost:4000/api/auth/signup', { name, email, password })
      setAccessToken(data.access)
      setUser(data.user)
      localStorage.setItem('accessToken', data.access)
      localStorage.setItem('user', JSON.stringify(data.user))
    } catch (error) {
      console.error('Signup failed:', error)
    }
  }

  // Logout method
  const logout = () => {
    setUser(null)
    setAccessToken(null)
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
  }

  return (
    <AuthContext.Provider value={{ user, accessToken, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
