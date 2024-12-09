import './assignments.css';
import { useEffect, useState } from 'react';

function Assignment() {
  const [file, setFile] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name2)
    formData.append('subject', task.subject)
    formData.append('taskno', taskno)

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (response.ok) {
        alert('File uploaded successfully');
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

  const [name2, setName2] = useState('')

  useEffect(() => {
    const tasks = async () => {
      const data = await fetch('http://localhost:3000/namesetter', {
        method: 'GET',
        credentials: 'include'
      });
      const response = await data.json();
      setName2(response.firstname + ' ' + response.lastname)
    };
    tasks();
  }, []);

  const [task, setTask] = useState('');

  useEffect(() => {
    const fetchTask = async () => {
      const data = await fetch('http://localhost:3000/assignments', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }, 
      });

      const response = await data.json();
      setTask(response.data);
    };
    fetchTask();

  }, []);

  const [taskno, setTaskno] = useState('')

  const handleTaskno = (e) => {
    setTaskno(e.target.value)
  }
 
  /*
  const [ctask, setCTask] = useState('')

  useEffect(() => {
    const getTaskno = async () => {

      const results = await fetch('https://localhost:3000/taskno', {
        method : "GET",
        credentials : 'include',
        body : JSON.stringify({student : name2})
      });

      const response = results.json();
      

    }
    getTaskno();
  }, [])

  console.log(taskno)
 */
  return (
    <>
      {task.length > 0 ? (
  task.map((data) => {
    if (taskno.includes(data.id)) {
      return null;
    }
    return (
      <div id='assignments' key={data.id}>
        <div id='task'>
          <h2 className='subject_name'>{data.subject + '-' + data.id}</h2>
          <a id="download_btn" href={`http://localhost:3000/download?id=${data.id}`} download>
            Download Assignment
          </a>
          <div>
            <form className='mb-5' onSubmit={handleSubmit}>
              <button type='submit' className='submit_btn'>
                Submit Assignment
              </button>
              <input type='file' onChange={handleFileChange} />
              <input type='text' onChange={handleTaskno} placeholder='task-number'></input>
            </form>
          </div>
          <p className='submission_date'>Due date:<br />{data.due_date}</p>
        </div>
      </div>
    );
  })
) : (
  <p>No assignments found</p>
)}

    </>
  );
}

export default Assignment;
