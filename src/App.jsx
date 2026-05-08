import { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000'
})

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')

  useEffect(() => {
    fetchTasks()
  }, [])

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks')
      setTasks(response.data)
    } catch (error) {
      console.error('Erro ao buscar tarefas', error)
    }
  }

  const addTask = async (e) => {
    e.preventDefault()
    if (!title.trim()) return
    try {
      const response = await api.post('/tasks', { title })
      setTasks([...tasks, response.data])
      setTitle('')
    } catch (error) {
      console.error('Erro ao criar tarefa', error)
    }
  }

  const removeTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`)
      setTasks(tasks.filter(task => task.id !== id))
    } catch (error) {
      console.error('Erro ao remover tarefa', error)
    }
  }

  return (
    <div className="container">
      <div className="todo-app">
        <h1>Mini To-Do</h1>
        <form onSubmit={addTask} className="todo-form">
          <input 
            type="text" 
            placeholder="Adicionar nova tarefa..." 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <button type="submit">Adicionar</button>
        </form>
        <ul className="todo-list">
          {tasks.map(task => (
            <li key={task.id} className="todo-item">
              <span>{task.title}</span>
              <button 
                className="btn-remove" 
                onClick={() => removeTask(task.id)}
              >
                Remover
              </button>
            </li>
          ))}
          {tasks.length === 0 && (
             <li className="todo-empty">Nenhuma tarefa encontrada.</li>
          )}
        </ul>
      </div>
    </div>
  )
}

export default App
