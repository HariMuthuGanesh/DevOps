import { useState } from "react";
import Header from "./components/Header";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

function App() {
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", department: "CSE", roll: "101" },
    { id: 2, name: "Jane Smith", department: "ECE", roll: "102" }
  ]);

  const handleAddStudent = (newStudent) => {
    setStudents((prev) => [...prev, { ...newStudent, id: Date.now() }]);
  };

  const handleDeleteStudent = (id) => {
    setStudents((prev) => prev.filter((student) => student.id !== id));
  };

  return (
    <div className="container">
      <Header />
      <StudentForm onAddStudent={handleAddStudent} />
      <StudentList students={students} onDeleteStudent={handleDeleteStudent} />
    </div>
  );
}

export default App;