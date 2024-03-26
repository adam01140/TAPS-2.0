const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

let citations = []; // In-memory storage for citations

app.post('/api/citations', (req, res) => {
    const { password, licensePlate, citationNumber, timeOccurred, locationOccurred } = req.body;

    if (password === 'N@vy0114') {
        if (licensePlate) {
            const newCitation = { licensePlate, citationNumber, timeOccurred, locationOccurred, timestamp: new Date().toISOString() };
            citations.push(newCitation);
            res.status(201).json(newCitation);
        } else {
            // Return all citations if password is correct and request is for getting citations
            res.json([...citations].reverse());
        }
    } else {
        res.status(403).send('Unauthorized access');
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
