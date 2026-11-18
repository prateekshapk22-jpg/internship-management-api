
const express = require('express');
const path = require('path');
const db = require('./database/db');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const internshipRoutes = require('./routes/internshipRoutes');

const app = express();

// 1. Security HTTP headers
app.use(helmet());

// 2. CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173',
    process.env.CLIENT_URL
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        return callback(new Error('Origin not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
    credentials: false
}));

// 3. Limit JSON request size
app.use(express.json({ limit: '10kb' }));

// 4. API rate limiting
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        success: false,
        message: 'Too many requests. Please try again after 15 minutes.'
    }
});

app.use('/api', apiLimiter);

// 5. Serve frontend static files
app.use(express.static(path.join(__dirname, 'public')));

// 6. Home route - Display frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 7. Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API is healthy'
    });
});

// 8. Test database connection
app.get('/api/test-db', (req, res) => {
    db.get('SELECT 1 AS result', (err, row) => {
        if (err) {
            console.error('Database test failed:', err.message);

            return res.status(500).json({
                success: false,
                message: 'Database connection failed'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Database connected successfully!',
            result: row.result
        });
    });
});

// 9. Internship CRUD routes
app.use('/api/internships', internshipRoutes);

// 10. Handle unknown routes
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// 11. Centralized error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);

    if (err.message === 'Origin not allowed by CORS') {
        return res.status(403).json({
            success: false,
            message: 'Access denied by CORS policy'
        });
    }

    res.status(err.status || 500).json({
        success: false,
        message: err.status
            ? err.message
            : 'Internal server error'
    });
});

// 12. Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
