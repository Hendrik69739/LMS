import { useEffect, useState } from "react";

function upload(){

    const [date, setDate] = useState([])

    useEffect(() => {
        const fetchAssingments = async () => {
            await fetch('http://localhost:3000/')
        }
        fetchAssingments();
        }, [])

    return(
        <section id="admin_assignment_section">
        <form onSubmit="" className="input_fields">
            <label>Subject:<input type="text" placeholder="task subject" onChange="" className="mb-2"/></label>
            <label>Task pdf:<input type="file" accept="pdf" onChange="" className="mb-2"/></label>
            <label>Due Date:<input type="date" placeholder="task subject" onChange="" className="mb-2"/></label>
            <button type="submit" className="upload_button">Upload Task</button>
        </form>
        <div className="ms6">
            <h3>Subject</h3>
            <p>Due date</p>
            <a href="" className="delete_link">Delete Task</a>
        </div>
</section>
    )
}

export default upload;