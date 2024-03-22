const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();

// Use the environment variable PORT, or 8080 if there's nothing there.
const PORT = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors());

// Use express.json() middleware for parsing JSON in request bodies
app.use(express.json());

// Serve static files (e.g., index.html, CSS, JavaScript, images, etc.)
// directly from the root directory since there is no 'public' folder
app.use(express.static(path.join(__dirname)));

// In-memory array to store citation records
let citations = [];

// POST endpoint to receive and add a new citation
app.post('/api/citations', (req, res) => {
    const { citationNumber, timeOccurred, locationOccurred, licensePlate } = req.body;
    
    // Check for missing fields in the request body
    if (!citationNumber || !timeOccurred || !locationOccurred || !licensePlate) {
        return res.status(400).send('Missing fields in request body');
    }
    
    // Create a new citation object
    const newCitation = { citationNumber, timeOccurred, locationOccurred, licensePlate };
    
    // Add the new citation to the array
    citations.push(newCitation);
    
    // Respond with the added citation and a 201 Created status code
    res.status(201).json(newCitation);
});

// GET endpoint to return all citations, sorted from oldest to newest
app.get('/api/citations', (req, res) => {
    // Reverse the citations array to display from oldest to newest
    res.json([...citations].reverse());
});

// If no other route matches, serve index.html for any other GET request
// This is useful for single-page applications
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
