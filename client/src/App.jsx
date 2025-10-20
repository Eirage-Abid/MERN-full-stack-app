import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './app/authContext'
import NavBar from './components/Navbar'
import TasksListPage from './features/tasks/TasksListPage'
import LoginPage from './features/auth/LoginPage'
import SignupPage from './features/auth/SignupPage'
import NotFoundPage from './pages/NotFoundPage'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <NavBar />
          <Routes>
            <Route path="/" element={<div className="text-center py-12"><h1 className="text-2xl font-bold">Welcome to TaskForge</h1><p className="text-gray-600 mt-2">Please login to manage your tasks</p></div>} />
            <Route path="/tasks" element={
              <ProtectedRoute>
                <TasksListPage />
              </ProtectedRoute>
            } />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  )
}

export default App
