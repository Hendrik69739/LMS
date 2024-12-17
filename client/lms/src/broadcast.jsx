import './broadcast.css'
import { useEffect, useState } from 'react';

function Broadcast(){
    
    const [dataset, setDataset] = useState([])

    useEffect(() => {
        const information = async () =>{
            const results = await fetch('https://lms-tcr1.onrender.com/anouncements', {
                method : 'POST',
                credentials : 'include'
            })

            const response = await results.json();
            setDataset(response.results)
            
        }
        information();
    }, [])

    
    const time = new Date();
    const day = time.getDay();
    const month = time.getMonth();
    const year = time.getFullYear()

    const date = day + '/' + month + '/' + year;

    const [text, setText] = useState('')

    const handleText = (e) => {
        setText(e.target.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

     await fetch('https://lms-tcr1.onrender.com/sendAnouncements', {
            method : 'POST',
            credentials : 'include',
            headers: { 
                'Content-Type': 'application/json',
             },
            body : JSON.stringify({text : text, date : date})
        })
    }

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`https://lms-tcr1.onrender.com/deleteAnouncement/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setDataset(dataset.filter(item => item.id !== id));
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

    return(
        <main className="anouncement-main">
            {dataset.length > 0 ? 
    dataset.map((data) => (
        <div id="text-content" key={data.id}>
        <div className="ms2">
            <div className="anouncement">
                <p className="anouncement-text">
                    {data.text}
                </p>
                <sub>{data.date}</sub>
            </div>
            <a href="#" onClick={(e) => handleDelete(e, data.id)}>delete</a>
        </div>
    </div>
    )) : <></>}
    <form onSubmit={handleSubmit}>
    <textarea className="textarea-admin" onChange={handleText}></textarea>
    <button type='submit'> submit</button>
    </form>

    </main>
    )
}

export default Broadcast;