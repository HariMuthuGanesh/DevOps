import { useState } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn DevOps & GitHub Commands', completed: true },
    { id: 2, text: 'Set up Jenkins Pipeline Automation', completed: false },
    { id: 3, text: 'Build React Applications', completed: false }
  ]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('all');

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newTodo = {
      id: Date.now(),
      text: input.trim(),
      completed: false
    };

    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const handleToggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const handleDeleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <div className="todo-container">
      <header className="todo-header">
        <h1>📝 Todo List</h1>
        <p>Simple & Powerful React Task Tracker</p>
      </header>

      <form className="todo-form" onSubmit={handleAddTodo}>
        <input
          type="text"
          className="todo-input"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="add-btn">
          Add
        </button>
      </form>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({todos.length})
        </button>
        <button
          className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
          onClick={() => setFilter('active')}
        >
          Active ({todos.filter((t) => !t.completed).length})
        </button>
        <button
          className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
          onClick={() => setFilter('completed')}
        >
          Completed ({todos.filter((t) => t.completed).length})
        </button>
      </div>

      <ul className="todo-list">
        {filteredTodos.length === 0 ? (
          <li className="empty-message">No tasks found!</li>
        ) : (
          filteredTodos.map((todo) => (
            <li
              key={todo.id}
              className={`todo-item ${todo.completed ? 'completed' : ''}`}
            >
              <div
                className="todo-content"
                onClick={() => handleToggleTodo(todo.id)}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleTodo(todo.id)}
                />
                <span className="todo-text">{todo.text}</span>
              </div>
              <button
                className="delete-btn"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ✕
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default App;