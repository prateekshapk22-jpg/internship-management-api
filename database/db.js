
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(
    path.join(__dirname, 'internships.db'),
    (err) => {
        if (err) {
            console.error('Database connection failed:', err.message);
        } else {
            console.log('SQLite Database connected successfully!');
        }
    }
);

module.exports = db;

db.run(`
    CREATE TABLE IF NOT EXISTS internships (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        company TEXT NOT NULL,
        location TEXT,
        duration TEXT,
        stipend TEXT,
        description TEXT,
        eligibility TEXT,
        application_link TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) {
        console.error('Table creation failed:', err.message);
    } else {
        console.log('Internships table created successfully!');
    }
});
