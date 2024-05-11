const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const csvParse = require('csv-parse');
const admin = require('firebase-admin');
const fetch = require('node-fetch'); // Make sure node-fetch is installed

const app = express();
const PORT = process.env.PORT || 8080;

// Initialize Firebase Admin SDK
const serviceAccount = require('./transfer.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// Setup multer for file storage in memory
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

let citations = [];

async function transferData() {
  const snapshot = await db.collection('citations').get();
  snapshot.forEach(async (doc) => {
    const citationData = doc.data();
    const dateTimeISO = `${citationData.timestamp.split('/').reverse().join('-')}T${citationData.time.slice(0, 2)}:${citationData.time.slice(2, 4)}:00Z`;
    const postData = {
      citationNumber: citationData.citationNumber || 'Unavailable',
      timeOccurred: dateTimeISO,
      locationOccurred: citationData.college || 'Unavailable',
      licensePlate: citationData.licensePlate || 'Unavailable',
    };
    try {
      const response = await fetch('https://taps-2-0.onrender.com/api/citations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      const responseData = await response.json();
      console.log('Successfully transferred citation data:', responseData);
    } catch (error) {
      console.error('Error transferring citation data:', error);
    }
  });
}

// Run transferData on server start
transferData();

app.post('/api/citations', (req, res) => {
    const { citationNumber, timeOccurred, locationOccurred, licensePlate } = req.body;
    const newCitation = {
        citationNumber,
        timeOccurred,
        locationOccurred,
        licensePlate,
        timestamp: new Date().toISOString()
    };
    citations.push(newCitation);
    res.status(201).json(newCitation);
});

app.get('/api/citations', (req, res) => {
    const { password } = req.query;
    if (password !== 'N@vy0114') {
        return res.status(401).json({ message: 'Unauthorized: Incorrect password' });
    }
    res.json([...citations].reverse());
});

app.delete('/api/citations/:citationNumber', (req, res) => {
    const citationNumber = req.params.citationNumber;
    const index = citations.findIndex(c => c.citationNumber === citationNumber);
    if (index === -1) {
        return res.status(404).send('Citation not found');
    }
    citations.splice(index, 1);
    res.status(200).send('Citation deleted successfully');
});

app.post('/api/upload-csv', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded');
    }

    csvParse(req.file.buffer, {
        columns: true,
        trim: true
    }, (err, records) => {
        if (err) {
            return res.status(500).send('Error parsing CSV data');
        }
        records.forEach(record => {
            citations.push({
                citationNumber: record.citationNumber || "Unavailable",
                timeOccurred: record.timeOccurred || "Unavailable",
                locationOccurred: record.locationOccurred || "Unavailable",
                licensePlate: record.licensePlate || "Unavailable",
                timestamp: new Date().toISOString()
            });
        });
        res.send(`Processed ${records.length} citations from CSV`);
    });
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
