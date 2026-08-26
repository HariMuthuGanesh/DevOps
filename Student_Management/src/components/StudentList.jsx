import StudentCard from "./StudentCard";

function StudentList({ students, onDeleteStudent }) {
    return (
        <div className="student-list-container">
            <h2>Student List ({students.length})</h2>
            {students.length === 0 ? (
                <p className="no-students">No student records found. Add a student above!</p>
            ) : (
                <div className="student-grid">
                    {students.map((student) => (
                        <StudentCard
                            key={student.id}
                            student={student}
                            onDeleteStudent={onDeleteStudent}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default StudentList;