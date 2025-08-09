// src/services/api.js
import axios from 'axios'

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
})

// Sections
export const getSections = () => API.get('/sections')
export const createSection = (data) => API.post('/sections', data)

// Tasks
export const createTask = (data) => API.post('/tasks', data)
export const updateTask = (id, data) => API.put(`/tasks/${id}`, data)
export const deleteTask = (id) => API.delete(`/tasks/${id}`)

export default API
