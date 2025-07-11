import { useEffect, useState } from 'react';
import './admin_assignment_panel.css';

function UploadTask() {
    const [file, setFile] = useState('');
    const [name2, setName2] = useState('');
    const [task, setTask] = useState([]);
    const [taskno, setTaskno] = useState('');
    const [date, setDate] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const fetchTask = async () => {
        try {
            const data = await fetch('http://localhost:3000/assignments', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
            });

            const response = await data.json();
            setTask(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('file', file);
        formData.append('name', name2);
        formData.append('date', date);
        formData.append('taskno', taskno);

        try {
            const response = await fetch('http://localhost:3000/uploadTask', {
                method: 'POST',
                body: formData,
                credentials: 'include',
            });

            if (response.ok) {
                alert('File uploaded successfully');
                fetchTask();
            } else {
                const errorText = await response.text();
                console.error('File upload failed:', errorText);
                alert('File upload failed: ' + errorText);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
            alert('Error uploading file: ' + error.message);
        }
    };

    useEffect(() => {
        const tasks = async () => {
            const data = await fetch('http://localhost:3000/namesetter', {
                method: 'POST',
                credentials: 'include'
            });
            const response = await data.json();
            setName2(response.firstname + ' ' + response.lastname);
        };

        tasks();
        fetchTask(); 
    }, []);

    const handleTaskno = (e) => setTaskno(e.target.value);
    const handleDate = (e) => setDate(e.target.value);

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
        <section id="admin_assignment_section">
            <form onSubmit={handleSubmit} className="input_fields">
                <label>Task no:<input type='text' onChange={handleTaskno}></input></label>
                <label>Task pdf:<input type="file" accept=".pdf" onChange={handleFileChange} className="mb-2" /></label>
                <label>Due Date:<input type="date" placeholder="due date" onChange={handleDate} className="mb-2" /></label>
                <button type="submit" className="upload_button">Upload Task</button>
            </form>
            {task.length > 0 && task.map((data, index) => (
                <div key={index} className="ms6">
                    <h3>{data.subject}</h3>
                    <p>submission date<br />{data.due_date}</p>
                    <a href="#" onClick={(e) => handleDelete(e, data.id)} className="delete_link">Delete Task</a>
                </div>
            ))}
        </section>
    );
}

export default UploadTask;