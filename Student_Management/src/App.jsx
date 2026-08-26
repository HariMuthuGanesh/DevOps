import { useState } from "react";
import Header from "./components/Header";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";
import "./App.css";

function App() {

  const [students, setStudents] = useState([]);

  return (
    <div className="container">
      <Header />
      <StudentForm />
      <StudentList />
    </div>
  );
}

export default App;