
const express = require('express');
const db = require('./database/db');
const internshipRoutes = require('./routes/internshipRoutes');

const app = express();

// Middleware to read JSON data
app.use(express.json());

// Home route
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Internship Management API is running!',
        status: 'Success'
    });
});

// Test database connection
app.get('/api/test-db', (req, res) => {
    db.get('SELECT 1 AS result', (err, row) => {
        if (err) {
            return res.status(500).json({
                message: 'Database connection failed',
                error: err.message
            });
        }

        res.status(200).json({
            message: 'Database connected successfully!',
            result: row.result
        });
    });
});

// Connect internship CRUD routes
app.use('/api/internships', internshipRoutes);

// Start server
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
