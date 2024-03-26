const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files

let citations = []; // In-memory storage for citations



const passwordHash = 'hashed_password'; // You should store a hashed version of your password here for security reasons

let isAuthenticated = false;

// POST endpoint to verify password
app.post('/api/verify', (req, res) => {
    const { password } = req.body;
    
    if (password === 'N@vy0114') {
        isAuthenticated = true;
        res.json({ accessGranted: true });
    } else {
        isAuthenticated = false;
        res.json({ accessGranted: false });
    }
});

// GET endpoint to fetch all citations
app.get('/api/citations', (req, res) => {
    if (!isAuthenticated) {
        return res.status(403).json({ error: "Unauthorized access!" });
    }
    
    res.json([...citations].reverse()); // Return citations from oldest to newest
});

/*
// GET endpoint to fetch all citations
app.get('/api/citations', (req, res) => {
    res.json([...citations].reverse()); // Return citations from oldest to newest
});
*/


// DELETE endpoint to remove a citation by its citation number
app.delete('/api/citations/:citationNumber', (req, res) => {
    const citationNumber = req.params.citationNumber;
    const index = citations.findIndex(c => c.citationNumber === citationNumber);
    if (index === -1) {
        return res.status(404).send('Citation not found');
    }
    citations.splice(index, 1); // Remove the citation
    res.status(200).send('Citation deleted successfully');
});

// Serve index.html for any other GET request
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
