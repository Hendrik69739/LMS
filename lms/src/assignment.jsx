import './assignments.css'
import { useState } from 'react';

function Assignment() {

   const [file, setFile] = useState('')

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
            alert('File upload failed');
         }
      } catch (error) {
         console.error('Error uploading file:', error); 
         alert('Error uploading file');
      }
   };


return (
   <div id='assignments'>
      <div id='task'>
         <h3 className='subject_name'>Subject name</h3>
         <a id="download_btn" href="http://localhost:3000/download?id=1" download>Download Assignment</a>
         <div>
            <form className='mb-5' onSubmit={handleSubmit}>
               <button type='submit' className='submit_btn'>
                  <a>Submit Assignment</a>
               </button>
               <input type='file' onChange={handleFileChange}></input>
            </form>

         </div>
         <p className='submission_date'>date time</p>
      </div>

   </div>
)
}

export default Assignment;