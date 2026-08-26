import { useState } from "react";

function StudentForm({ onAddStudent }) {
    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [roll, setRoll] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!name.trim() || !department.trim() || !roll.trim()) {
            setError("All fields are required!");
            return;
        }

        onAddStudent({
            name: name.trim(),
            department: department.trim(),
            roll: roll.trim()
        });

        setName("");
        setDepartment("");
        setRoll("");
        setError("");
    };

    return (
        <form className="student-form" onSubmit={handleSubmit}>
            <h3>Add New Student</h3>
            {error && <p className="error-message">{error}</p>}
            <div className="form-group">
                <input
                    type="text"
                    placeholder="Student Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Department (e.g. CSE, ECE)"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Roll Number"
                    value={roll}
                    onChange={(e) => setRoll(e.target.value)}
                />
                <button type="submit" className="add-btn">Add Student</button>
            </div>
        </form>
    );
}

export default StudentForm;