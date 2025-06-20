import { useEffect, useState } from "react";
import './dock.css';

function Assignments() {
    const [task, setTask] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(false);

    const profsec =  document.getElementById('prof_section');
    const alet = document.createElement('div');
    alet.setAttribute('id', 'alert')


    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:3000/student_submissions', {
                    method: 'POST',
                    credentials: 'include',
                    headers: { 'Content-Type': 'application/json' },
                });
                const data = await response.json();
                console.log('thes are the tasks', data.results)
                setTask(data.results);
            } catch (error) {
                console.error('Failed to fetch tasks:', error);
                alet.innerHTML = 'Failed to fetch tasks';
                profsec.appendChild(alet)
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [alet, profsec]);

    const handleDelete = async (e, id) => {
        e.preventDefault();
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        setDeleting(true);
        try {
            const response = await fetch(`http://localhost:3000/deleteAssignment/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setTask(task.filter(item => item.id !== id));
                alet.innerHTML = 'Task deleted successfully';
                profsec.appendChild(alet)
            } else {
                const errorText = await response.text();
                console.error('Failed to delete task:', errorText);
                alet.innerHTML = 'Failed to delete task';
                profsec.appendChild(alet)
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            alet.innerHTML = 'Error deleting task';
                profsec.appendChild(alet)
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
                        <div id="submitted_task" className="task">
                          <p className="task-subject">{data.subject}</p>
                          <p className="task-time">{data.time_submitted}</p>
                          <a className="task-delete" onClick={(e) => handleDelete(e, data.id)} disabled={deleting}>Delete task</a>
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
