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
  const day = time.getDate() + '/' + (time.getMonth() + 1) + '/' + time.getFullYear();

  const handleSubmit = async (e, subject) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name2);
    formData.append('subject', subject);
    formData.append('taskno', taskno);
    formData.append('date', day);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();
      const angle = document.createElement('div');
      angle.className = 'angle';
      angle.innerHTML = data.message;

      if (data.message) {
       document.getElementById('sheriff').appendChild(angle);
       setTimeout(() => {
        angle.remove();
      }, 3000);
      
     } else {
         document.getElementById('sheriff').appendChild(angle);
       setTimeout(() => {
        angle.remove();
      }, 3000);
      }

    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Error uploading file: ' + error.message);
    }
  };

  useEffect(() => {
    const fetchName = async () => {
      const data = await fetch('http://localhost:3000/namesetter', {
        method: 'POST',
        credentials: 'include',
      });
      const response = await data.json();
      setName2(`${response.firstname} ${response.lastname}`);
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
      console.log(response.data)
    };

    fetchTask();
  }, []);

  console.log(task);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const loader = document.getElementsByClassName('loader')[0];
      if (loader) loader.remove();
    }, 3000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
    <div id='sheriff'></div>
      {task.length > 0 ? (
        task.map((data) => (
          <div id="assignments" key={data.id} className="assignment-container">
            <div id="task" className="task-container">
              <h2 className="subject_name">{`${data.subject} - ${data.id}`}</h2>
              <a
                id="download_btn"
                className="download-btn"
                href={`http://localhost:3000/download/${data.id}`}
                download
              >
                Download Assignment
              </a>
              <form
                className="mb-5 task-form"
                onSubmit={(e) => handleSubmit(e, data.subject)}
              >
                <button type="submit" className="submit-btn">
                  Submit Assignment
                </button>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="file-input"
                />
                <input
                  type="text"
                  onChange={handleTaskno}
                  placeholder="Task Number"
                  className="task-number-input"
                />
              </form>
              <p className="submission_date">
                Due date:<br />
                {data.due_date}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="empty-assignments">
          <div className="loader" />
          <p>No assignments</p>
        </div>
      )}
    </>
  );
}

export default Dock;