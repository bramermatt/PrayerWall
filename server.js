const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = 3000;

// Database connection
const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432,
});

app.use(cors());
app.use(express.json());

// Get all prayers
app.get('/prayers', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM prayers ORDER BY id DESC');
        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Add a new prayer
app.post('/prayers', async (req, res) => {
    const { prayer, name, email, church, dateTime } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO prayers (prayer, name, email, church, dateTime, prayedCounter) VALUES ($1, $2, $3, $4, $5, 0) RETURNING *',
            [prayer, name, email, church, dateTime]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

// Update the prayer count
app.put('/prayers/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            'UPDATE prayers SET prayedCounter = prayedCounter + 1 WHERE id = $1 RETURNING *',
            [id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});