import './assignments.css'

function Assignment(){
return(
   <div id='assignments'>
     <div id='task'>
        <h3 className='subject_name'>Subject name</h3>
        <a id="download_btn" href="http://localhost:3000/download?id=1" download>Download Assignment</a>
        <div>
       <form className='mb-5'>
       <button type='submit' className='submit_btn'>
                <a>Submit Assignment</a>
            </button>
            <input type='file'></input>
       </form>
           
        </div>
        <p className='submission_date'>date time</p>
    </div>

   </div>
)
}

export default Assignment;