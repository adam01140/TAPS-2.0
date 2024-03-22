const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname))); // Serve static files

let citations = []; // In-memory storage for citations

// POST endpoint to add a citation
app.post('/api/citations', (req, res) => {
    const { citationNumber, timeOccurred, locationOccurred, licensePlate } = req.body;
    if (!citationNumber || !timeOccurred || !locationOccurred || !licensePlate) {
        return res.status(400).send('Missing fields in request body');
    }
    const newCitation = { citationNumber, timeOccurred, locationOccurred, licensePlate };
    citations.push(newCitation); // Add the new citation
    res.status(201).json(newCitation);
});

// GET endpoint to fetch all citations
app.get('/api/citations', (req, res) => {
    res.json([...citations].reverse()); // Return citations from oldest to newest
});

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
