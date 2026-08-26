import { useState } from "react";
import "./App.css";

function App() {
  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  function addTodo() {
    if (!todo.trim()) return;
    setTodos([...todos, todo.trim()]);
    setTodo("");
  }

  function deleteTodo(index) {
    const updatedTodos = todos.filter((item, i) => i !== index);
    setTodos(updatedTodos);
    if (editIndex === index) {
      setEditIndex(null);
    }
  }

  function startEdit(index) {
    setEditIndex(index);
    setEditText(todos[index]);
  }

  function saveUpdate(index) {
    if (!editText.trim()) return;
    const updatedTodos = todos.map((item, i) =>
      i === index ? editText.trim() : item
    );
    setTodos(updatedTodos);
    setEditIndex(null);
    setEditText("");
  }

  function cancelEdit() {
    setEditIndex(null);
    setEditText("");
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
            {editIndex === index ? (
              <div className="edit-group">
                <input
                  type="text"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                />
                <button className="save-btn" onClick={() => saveUpdate(index)}>
                  Save
                </button>
                <button className="cancel-btn" onClick={cancelEdit}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <span>{item}</span>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => startEdit(index)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => deleteTodo(index)}>
                    Delete
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;