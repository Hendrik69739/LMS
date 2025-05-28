import { useState } from "react";
import { useEffect } from "react";



function Examdates(){

    const [data, setData] = useState('');


   useEffect(() => {
    const details = async () => {

        const results = await fetch('', {
            headers : {'Content-Type' : 'application/json'},
            credentials : "include"
        })

        const data = await results.json();
        setData(data);


    }
    details();
   }, [])

    return(
        <div>
           {data.map((data) => {
            <div id="date_block" key={data.date}>
                <h1>{data.subject}</h1>
                <h1>{data.date}</h1>
                <h2>{data.time}</h2>
            </div>
           })}
        </div>
    );
}

export default Examdates;