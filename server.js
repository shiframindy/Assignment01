// Import the Express module
const express = require('express');
const https = require('https');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname)));

let cachedUsers = [];

function fetchUsers() {
    const url = 'https://randomuser.me/api/?results=1000&inc=name,gender,email,location,phone,cell,dob,picture&noinfo';

    https.get(url, (res) => {
        console.log(`Status Code: ${res.statusCode}`);
        
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            try {
                const parsed = JSON.parse(data);
                cachedUsers = parsed.results;
                console.log('Fetched 1000 users from Random User API');
            } catch (err) {
                console.error('Failed to parse user data:', err.message);
            }
        });
    }).on('error', (err) => {
        console.error('Error fetching users:', err.message);
    });
}       

fetchUsers();

// Define a route for GET requests
app.get('/', (req, res) => {
    if (cachedUsers.length === 0) {
        return res.status(503).send('User data is not available yet. Please try again later.');
    }
    const randomUser = cachedUsers[Math.floor(Math.random() * cachedUsers.length)];
    res.json({results: [randomUser]});
});

app.get('/api', (req, res) => {
    const count = parseInt(req.query.results) || 1;
    if (cachedUsers.length === 0) {
        return res.status(503).json({ error: 'User data is not yet available. Please try again later.' });
    }
    const selectedUsers = cachedUsers.slice(0, count);
    res.json({ results: selectedUsers });
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});