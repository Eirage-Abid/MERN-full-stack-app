import React from 'react'
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import NavBar from './components/Navbar'
import TasksListPage from './features/tasks/TasksListPage'
import LoginPage from './features/auth/LoginPage'
import SignupPage from './features/auth/SignupPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <div className="App">
      <Router>
        {/* Navbar component */}
        <NavBar />

        <Routes>
          {/* Home route */}
          <Route path="/" element={<TasksListPage />} />

          {/* Authentication routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Fallback for unknown routes */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
