import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState('');
    const [editId, setEditId] = useState(null);

    const API_URL = 'http://localhost:5001/todos'; //macOS uses port 5000

    // Fetch Todos (GET)
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setTodos(data));
    }, []);

    // Add Todo (POST)
    const addTodo = () => {
        if (!task) return;

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task, completed: false })
        })
            .then(res => res.json())
            .then(newTodo => {
                setTodos([...todos, newTodo]);
                setTask('');
            });
    };

    // Delete Todo (DELETE)
    const deleteTodo = (id) => {
        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            .then(() => setTodos(todos.filter(t => t.id !== id)));
    };

    // START EDIT
    const startEdit = (todo) => {
        setTask(todo.task);
        setEditId(todo.id);
    };

    // PATCH/UPDATE
    const saveEdit = () => {
        if (!task || editId === null) return;

        fetch(`${API_URL}/${editId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task })
        })
            .then(res => res.json())
            .then(updatedTodo => {
                setTodos(todos.map(t =>
                    t.id === editId ? updatedTodo : t
                ));
                setTask('');
                setEditId(null);
            });
    };

    return (
        <div className="min-vh-100 d-flex flex-column align-items-center"
            style={{ backgroundColor: "#1E1E2F", paddingTop: "40px" }}>

            <h1 className="text-white mb-4">To-Do List</h1>

            <div className="d-flex gap-2 mb-4 w-50">
                <input
                    className="form-control form-control-lg"
                    placeholder="Enter a task..."
                    value={task}
                    onChange={(e) => setTask(e.target.value)}/>

                <button
                    className="btn btn-success btn-lg"
                    onClick={editId ? saveEdit : addTodo}>
                    {editId ? "Save" : "Add"}
                </button>
            </div>
            <ol className="list-group w-50">
                {todos.map(t => (
                    <li
                        className="list-group-item d-flex justify-content-between align-items-center mb-3"
                        key={t.id}>
                        <span style={{ fontSize: "18px" }}>{t.task}</span>

                        <div className="d-flex gap-2">
                            <button className="btn btn-primary btn-lg" onClick={() => startEdit(t)}> Edit </button>
                            <button className="btn btn-danger btn-lg" onClick={() => deleteTodo(t.id)}> Delete </button>
                        </div>
                    </li>
                ))}
            </ol>

        </div>
    );
}

export default App;