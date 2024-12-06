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

  const [name, setName] = useState('');

  useEffect(() => { 
      const tasks = async () => { 
          const data = await fetch('http://localhost:3000/namesetter', { 
              method: 'GET', 
              credentials: 'include' 
          }); 
          const response = await data.json(); 
          setName(response.firstname); 
      }; 
      tasks(); 
  }, []);
  
  const [task, setTask] = useState('');

  useEffect(() => {
      const fetchTask = async () => {
          const data = await fetch('http://localhost:3000/assignments', {
              method: 'POST',
              credentials: 'include',
              headers: { 'Content-Type': 'application/json' }, // Ensure headers are set for JSON body
              body: JSON.stringify({ name: name })
          });

          const response = await data.json();
          setTask(response.data[0]); // Set the parsed response in state
      };

      if (name) {
          fetchTask(); 
      }
  }, [name]); // Added `name` as a dependency here

  return (
    <div id='assignments'>
      <div id='task'>
        <h2 className='subject_name'>{task.subject}</h2>
        <a id="download_btn" href="http://localhost:3000/download?id=5" download>
          Download Assignment
        </a>
        <div>
          <form className='mb-5' onSubmit={handleSubmit}>
          <button type='submit' className='submit_btn'>
              Submit Assignment
            </button>
            <input type='file' onChange={handleFileChange} />
          </form>
        </div>
        <p className='submission_date'>Due date:<br/>{task.due_date}</p>
      </div>
    </div>
  );
}

export default Assignment;
