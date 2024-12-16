import './assignments.css';
import { useEffect, useState } from 'react';

function Dock() {
  const [file, setFile] = useState('');
  const [name2, setName2] = useState('');
  const [task, setTask] = useState([]);
  const [taskno, setTaskno] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTaskno = (e) => {
    setTaskno(e.target.value);
  };

  const handleSubmit = async (e, subject) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name2);
    formData.append('subject', subject);
    formData.append('taskno', taskno);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
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

  useEffect(() => {
    const fetchName = async () => {
      const data = await fetch('http://localhost:3000/namesetter', {
        method: 'GET',
        credentials: 'include'
      });

      const response = await data.json();
      setName2(response.firstname + ' ' + response.lastname);
    };

    fetchName();
  }, []);

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

  return (
    <>
      {task.length > 0 ? (
        task.map((data) => {
          return (
            <div id='assignments' key={data.id}>
              <div id='task'>
                <h2 className='subject_name'>{`${data.subject} - ${data.id}`}</h2>
                <a id="download_btn" href={`http://localhost:3000/download?id=${data.id}`} download>
                  Download Assignment
                </a>
                <div>
                  <form className='mb-5' onSubmit={(e) => handleSubmit(e, data.subject)}>
                    <button type='submit' className='submit_btn'>
                      Submit Assignment
                    </button>
                    <input type='file' onChange={handleFileChange} />
                    <input type='text' onChange={handleTaskno} placeholder='task-number' />
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

export default Dock;
