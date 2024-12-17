import './broadcast.css'
import { useEffect, useState } from 'react';

function Broadcast(){
    
    const [dataset, setDataset] = useState([])

    useEffect(() => {
        const information = async () =>{
            const results = await fetch('https://lms-tcr1.onrender.com:3000/anouncements', {
                method : 'POST',
                credentials : 'include'
            })
            const response = await results.json();
            setDataset(response.results)
        }
        information();
    }, [])


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
        </div>
    </div>
    )) : <>No anouncements yet</>}
    </main>
    )
}

export default Broadcast;