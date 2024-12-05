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
        method : 'GET',
        credentials : 'include'
      })

      const response = data.json();
      setName(response.firstname)
    }

    tasks();
  }, [])

  const [task, setTask] = useState('')

  useEffect(() => {
    const fetchTask = async () => {
      const data = await fetch('http://localhost:3000/assignments', {
        method : "GET",
        credentials : 'include'
      })
      const response = await data.json();
      console.log(response)
    }
    fetchTask();
  })

  return (
    <></>
  );
}

export default Assignment;
