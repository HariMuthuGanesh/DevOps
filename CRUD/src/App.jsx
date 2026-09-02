import { useState } from "react";

function App() {

  const [students, setStudents] = useState([]);

  const [name, setName] = useState("");

  const [age, setAge] = useState("");

  const [editId, setEditId] = useState(null);

  function addStudent() {

    const student = {

      id: Date.now(),

      name,

      age

    };

    setStudents([...students, student]);

    setName("");

    setAge("");

  }

  function deleteStudent(id) {

    setStudents(

      students.filter(student => student.id !== id)

    );

  }

  function editStudent(student) {

    setEditId(student.id);

    setName(student.name);

    setAge(student.age);

  }

  function updateStudent() {

    setStudents(

      students.map(student => {

        if (student.id === editId) {

          return {

            ...student,

            name,

            age

          }

        }

        return student;

      })

    );

    setEditId(null);

    setName("");

    setAge("");

  }

  return (

    <div>

      <h1>Student CRUD</h1>

      <input

        value={name}

        onChange={(e) => setName(e.target.value)}

        placeholder="Name"

      />

      <input

        value={age}

        onChange={(e) => setAge(e.target.value)}

        placeholder="Age"

      />

      {

        editId ?

          <button onClick={updateStudent}>

            Update

          </button>

          :

          <button onClick={addStudent}>

            Add

          </button>

      }

      <hr />

      {

        students.map(student => (

          <div key={student.id}>

            <h3>{student.name}</h3>

            <p>{student.age}</p>

            <button onClick={() => editStudent(student)}>

              Edit

            </button>

            <button onClick={() => deleteStudent(student.id)}>

              Delete

            </button>

          </div>

        ))

      }

    </div>

  );

}

export default App;