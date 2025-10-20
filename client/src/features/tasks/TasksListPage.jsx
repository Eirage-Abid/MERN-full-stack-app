import React, { useState, useEffect } from 'react'
import { api } from '../../app/axios'

const TasksListPage = () => {
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formData, setFormData] = useState({ title: '', description: '', status: 'todo' })

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      setLoading(true)
      const { data } = await api.get('/tasks')
      setTasks(data.items)
    } catch (error) {
      console.error('Failed to fetch tasks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Load tasks on component mount
  useEffect(() => {
    fetchTasks()
  }, [])

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingTask) {
        // Update existing task
        await api.put(`/tasks/${editingTask._id}`, formData)
        setTasks(tasks.map(task => 
          task._id === editingTask._id ? { ...task, ...formData } : task
        ))
      } else {
        // Create new task
        const { data } = await api.post('/tasks', formData)
        setTasks([...tasks, data])
      }
      resetForm()
    } catch (error) {
      console.error('Failed to save task:', error)
    }
  }

  // Handle task deletion
  const handleDelete = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return
    
    try {
      await api.delete(`/tasks/${taskId}`)
      setTasks(tasks.filter(task => task._id !== taskId))
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  // Handle task status update
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus })
      setTasks(tasks.map(task => 
        task._id === taskId ? { ...task, status: newStatus } : task
      ))
    } catch (error) {
      console.error('Failed to update task status:', error)
    }
  }

  // Reset form
  const resetForm = () => {
    setFormData({ title: '', description: '', status: 'todo' })
    setEditingTask(null)
    setShowForm(false)
  }

  // Start editing a task
  const startEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status
    })
    setEditingTask(task)
    setShowForm(true)
  }

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'todo': return 'bg-gray-100 text-gray-800'
      case 'in_progress': return 'bg-blue-100 text-blue-800'
      case 'done': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading tasks...</div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Your Tasks</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Add New Task
        </button>
      </div>

      {/* Task Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">
              {editingTask ? 'Edit Task' : 'Add New Task'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition-colors"
                >
                  {editingTask ? 'Update' : 'Create'} Task
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tasks List */}
      {tasks.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg mb-4">No tasks yet</div>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Create your first task
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div key={task._id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{task.title}</h3>
                  {task.description && (
                    <p className="text-gray-600 mb-3">{task.description}</p>
                  )}
                  <div className="flex items-center space-x-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-sm text-gray-500">
                      Created: {new Date(task.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <select
                    value={task.status}
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    className="text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                  <button
                    onClick={() => startEdit(task)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(task._id)}
                    className="text-red-600 hover:text-red-800 text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TasksListPage
