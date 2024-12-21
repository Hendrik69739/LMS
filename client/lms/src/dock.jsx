import { useEffect, useState } from "react";
import './dock.css';

function Assignments() {
    const [task, setTask] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://lms-tcr1.onrender.com/student_submissions', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                setTask(data.results);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
                alert('Failed to fetch tasks: ' + error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, []);

    const handleDelete = async (e, id) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        setDeleting(true);
        try {
            const response = await fetch(`https://lms-tcr1.onrender.com/deleteAssignment/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setTask(task.filter(item => item.id !== id));
                alert('Task deleted successfully');
            } else {
                const errorText = await response.text();
                console.error('Failed to delete task:', errorText);
                alert('Failed to delete task: ' + errorText);
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alert('Error deleting task: ' + error.message);
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="assignments-cont">
            {loading ? <p>Loading assignments...</p> : (
                task.length > 0 ? 
                    task.map((data, index) => (
                        <div key={index} className="ms1">
                            <div id="submitted_task">
                                <p>{data.subject}</p>
                                <p>{data.time_submitted}</p>
                                <a onClick={(e) => handleDelete(e, data.id)} disabled={deleting}>Delete task</a>
                            </div>
                        </div>
                    ))
                : <div className='empty-assignments'>
          <p>No assignments submitted yet</p>
        </div>
            )}
        </div>
    );
}

export default Assignments;
