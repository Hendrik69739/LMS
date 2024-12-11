import { useEffect, useState } from "react";
import './dock.css';

function Dock() {
    
    const [task, setTask] = useState([]);

    useEffect(() => {
        const fetchTask = async () => {
            const data = await fetch('http://localhost:3000/assignments', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type' : 'application/json' }, 
            });

            const response = await data.json();
            setTask(response.data);
        };
        fetchTask();
    }, []);


    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/deleteTask/${id}`, {
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
        }
    };

    return (
        <>
            {task.length > 0 ? 
                task.map((data, index) => (
                    <div key={index} className="ms1">
                    <div id="submitted_task">
                        <p>{data.subject}</p>
                        <p>{data.due_date}</p>
                        <a onClick={(e) => handleDelete(e, data.id)}>Delete task</a>
                    </div>
                    </div>
                ))
            : 
                <>empty</>
            }
        </>
    );
}

export default Dock;
