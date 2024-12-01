{document.getElementById('form1').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

       await fetch('/auth/login', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify({ email: email, password: password })
})
.then(response => response.json())
.then(data => {
if (data.redirect) {
  window.location.href = data.redirect;
} else {
  console.error(data.message);
}
}).catch(error => {
console.error('Error:', error);
});

    }
)}