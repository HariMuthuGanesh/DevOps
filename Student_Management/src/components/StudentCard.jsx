function StudentCard({ student, onDeleteStudent }) {
    return (
        <div className="student-card">
            <div className="card-info">
                <span className="student-name">👤 {student.name}</span>
                <span className="badge dept-badge">Dept: {student.department}</span>
                <span className="badge roll-badge">Roll: {student.roll}</span>
            </div>
            <button className="delete-btn" onClick={() => onDeleteStudent(student.id)}>
                Delete
            </button>
        </div>
    );
}

export default StudentCard;