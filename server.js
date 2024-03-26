const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(bodyParser.json());

let citations = []; // Example citation data

// Middleware to check the password
function checkPassword(req, res, next) {
    const { password } = req.body;
    if (password !== 'N@vy0114') {
        return res.status(403).send('Unauthorized access');
    }
    next();
}

app.post('/api/citations', checkPassword, (req, res) => {
    // Assuming citations is an array of citation objects
    res.json(citations);
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
