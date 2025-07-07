import { useEffect, useState } from "react";
import { Link } from 'react-router-dom';
import './users.css';

function Users() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getUsers = async () => {
            try {
                const response = await fetch('http://localhost:3000/getUsers', {
                    method: 'POST',
                    credentials: 'include'
                });
                const data = await response.json();
                setUsers(data.results);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            }
        };
        getUsers();
    }, []);

    console.log(users)

    return (
        <section className="user_section">
            {users.length > 0 ? users.map((data) => {
                const std_id = data.id_number;
                return(
                    <Link id="user" key={data.firstname} to={`profile/${std_id}`}>
                    <h2>{data.firstname + ' ' + data.lastname}</h2>
                    <p>N3</p>
                </Link>
                )
            }) : <p>No users found</p>}
        </section>
    );
}

export default Users;
