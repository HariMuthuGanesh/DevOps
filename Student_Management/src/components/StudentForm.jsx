import { useState } from "react";

function StudentForm() {

    const [name, setName] = useState("");
    const [department, setDepartment] = useState("");
    const [roll, setRoll] = useState("");

    return (
        <form>

            <input
                type="text"
                placeholder="Student Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <input
                type="text"
                placeholder="Department"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
            />

            <input
                type="text"
                placeholder="Roll Number"
                value={roll}
                onChange={(e) => setRoll(e.target.value)}
            />

            <button>Add Student</button>

        </form>
    );
}

export default StudentForm;