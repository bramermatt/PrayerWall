const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json());
app.use(cors());

let prayers = [];

app.get('/prayers', (req, res) => {
    res.json(prayers);
});

app.post('/prayers', (req, res) => {
    const { prayer, name, email, church, dateTime } = req.body;
    if (prayer) {
        prayers.push({ prayer, name, email, church, dateTime });
        res.status(201).json({ message: 'Prayer added' });
    } else {
        res.status(400).json({ message: 'Prayer is required' });
    }
});

// Endpoint to clear the database
app.delete('/prayers', (req, res) => {
    prayers = [];
    res.status(200).json({ message: 'All prayers deleted' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});