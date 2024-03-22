const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // for parsing application/json

// In-memory storage for citations
let citations = [];

// POST endpoint to add a citation
app.post('/api/citations', (req, res) => {
    const { citationNumber, timeOccurred, locationOccurred, licensePlate } = req.body;
    if (!citationNumber || !timeOccurred || !locationOccurred || !licensePlate) {
        return res.status(400).send('Missing fields in request body');
    }

    const newCitation = {
        citationNumber,
        timeOccurred,
        locationOccurred,
        licensePlate,
    };

    // Add the new citation at the start of the array
    citations.push(newCitation);

    res.status(201).json(newCitation);
});

// GET endpoint to fetch all citations
// Adjusted to return citations from oldest to newest as per your requirement
app.get('/api/citations', (req, res) => {
    res.json(citations.slice().reverse()); // Reverse to show oldest first without altering original array
});

// Fallback route for undefined routes
app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
