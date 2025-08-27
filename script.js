let users = [];

function getUsers() {
    const count = parseInt(document.getElementById('userCount').value, 10);
    const errorEl = document.getElementById('error');
    const tableBody = document.getElementById('userTable');

    errorEl.textContent = '';
    tableBody.innerHTML = '';

    if (isNaN(count) || count < 0 || count > 1000) {
        errorEl.textContent = 'Please enter a valid number between 0 and 1000.';
        return;
    }

    fetch("https://randomuser.me/api/?results=" + count + "&inc=name,gender,email,location&noinfo")
        .then(res => res.json())
        .then(data => {
            users = data.results;
            showUsers();
        })
        .catch(() => {
            errorEl.textContent = 'Failed to fetch users. Please try again later.';
        });
  }
function showUsers() {
            const tableBody = document.getElementById("userTable");
            const nameType = document.getElementById("nameSelect").value;

            tableBody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name[nameType]}</td>
            <td>${user.gender}</td>
            <td>${user.email}</td>
            <td>${user.location.country}</td>
        </tr>
    `).join("");
}