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

  const time = new Date();
  const day = time.getDay() + '/' + time.getMonth() + '/' + time.getFullYear()

  const handleSubmit = async (e, subject) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name2);
    formData.append('subject', subject);
    formData.append('taskno', taskno);
    formData.append('date', day)

    try {
      const response = await fetch('https://lms-tcr1.onrender.com/upload', {
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
      const data = await fetch('https://lms-tcr1.onrender.com/namesetter', {
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
      const data = await fetch('https://lms-tcr1.onrender.com/assignments', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });

      const response = await data.json();
      setTask(response.data);
    };
    fetchTask();
  }, []);


  useEffect(() => {
    setTimeout(() => {
      document.getElementsByClassName('loader')[0].remove()
    }, 3000)
  })

  return (
    <>
      {task.length > 0 ? (
        task.map((data) => {
          return (
            <div id='assignments' key={data.id} className="assignment-container">
  <div id='task' className="task-container">
    <h2 className='subject_name'>{`${data.subject} - ${data.id}`}</h2>
    <a id="download_btn" className="download-btn" href={`https://lms-tcr1.onrender.com/download?id=${data.id}`} download>
      Download Assignment
    </a>
    <div>
      <form className='mb-5 task-form' onSubmit={(e) => handleSubmit(e, data.subject)}>
        <button type='submit' className='submit-btn'>
          Submit Assignment
        </button>
        <input type='file' onChange={handleFileChange} className='file-input' />
        <input type='text' onChange={handleTaskno} placeholder='Task Number' className='task-number-input' />
      </form>
    </div>
    <p className='submission_date'>Due date:<br />{data.due_date}</p>
  </div>
</div>
          );
        })
      ) : (
        <div className='empty-assignments'>
         <div className='loader'/>
        </div>
      )}
    </>
  );
}

export default Dock;
