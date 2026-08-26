import { useState } from "react";
import "./App.css";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  function addTodo() {
    if (!todo.trim()) return;
    setTodos([...todos, todo]);
    setTodo("");
  }

  function deleteTodo(index) {
    const updatedTodos = todos.filter((item, i) => i !== index);
    setTodos(updatedTodos);
  }

  return (
    <div className="todo-app">
      <h1>Todo App</h1>

      <div className="input-group">
        <input
          type="text"
          placeholder="Enter Todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
        />
        <button onClick={addTodo}>Add</button>
      </div>

      <ul>
        {todos.map((item, index) => (
          <li key={index}>
            <span>{item}</span>
            <button onClick={() => deleteTodo(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;