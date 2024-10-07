const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Load existing users from JSON file
let users = [];
if (fs.existsSync('users.json')) {
    users = JSON.parse(fs.readFileSync('users.json', 'utf8'));
}

// Registration endpoint
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;

    if (users.find(user => user.username === username)) {
        return res.status(400).json({ message: 'Username already exists' });
    }

    const newUser = { username, email, password };
    users.push(newUser);

    fs.writeFileSync('users.json', JSON.stringify(users, null, 2));
    res.status(200).json({ message: 'User registered successfully' });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const user = users.find(user => user.username === username && user.password === password);
    if (!user) {
        return res.status(400).json({ message: 'Invalid username or password' });
    }

    res.status(200).json({ message: 'Login successful' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
