import './broadcast.css';
import { useEffect, useState } from 'react';

function Broadcast() {
    const [dataset, setDataset] = useState([]);
    const [text, setText] = useState('');

    useEffect(() => {
        const information = async () => {
            const results = await fetch('http://localhost:3000/anouncements', {
                method: 'POST',
                credentials: 'include'
            });

            const response = await results.json();
            setDataset(response.results);
        };
        information();
    }, []);

    const date = new Date().toLocaleDateString('en-GB');

    const handleText = (e) => {
        setText(e.target.value);
    };

    function crc() {
        const ussr = document.createElement('div');
        ussr.innerHTML = 'Announcement Sent';
        ussr.setAttribute('id', 'popup-text');
        document.getElementById('popup').appendChild(ussr);

        setTimeout(() => {
            ussr.remove();
        }, 3000);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        const result = await fetch('http://localhost:3000/sendAnouncements', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ text, date })
        });

        const response = await result.json();

        if (response.message) {
            crc();
            setText('');
            const newItem = { id: response.id, text, date };
            setDataset((prev) => [newItem, ...prev]);
        }
    };

    const handleDelete = async (e, id) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:3000/deleteAnouncement/${id}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                setDataset((prev) => prev.filter((item) => item.id !== id));
                console.lo('Task deleted successfully');
            } else {
                const errorText = await response.text();
                console.log(errorText);
            }
        } catch (error) {
            console.log(error.message)
        }
    };

    return (
        <main className="anouncement-main">
  <div className="anouncement-list">
    {dataset.length ? (
      dataset.map((data) => (
        <div className="text-content" key={data.id}>
          <div className="ms2">
            <div className="anouncement">
              <p className="anouncement-text">{data.text}</p>
              <sub>{data.date}</sub>
            </div>
            <a
              href="#"
              className="broadcast-del-btn"
              onClick={(e) => handleDelete(e, data.id)}
            >
              delete
            </a>
          </div>
        </div>
      ))
    ) : (
      <p className="no-announcement">No announcements yet</p>
    )}
  </div>

  <form onSubmit={handleSubmit} id="vvt">
    <textarea
      className="textarea-admin"
      onChange={handleText}
      value={text}
      placeholder="Write your announcement..."
    ></textarea>
    <button type="submit" className="textarea-submit-button">
      <span className="material-symbols-outlined">send</span>
    </button>
  </form>

  <div id="popup"></div>
</main>
    );
}

export default Broadcast;