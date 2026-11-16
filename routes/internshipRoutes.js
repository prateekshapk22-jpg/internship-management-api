
const express = require('express');
const router = express.Router();
const db = require('../database/db');

// CREATE - Add a new internship
router.post('/', (req, res) => {
    const {
        title,
        company,
        location,
        duration,
        stipend,
        description,
        eligibility,
        application_link
    } = req.body;

    // Input validation
    if (!title || !company) {
        return res.status(400).json({
            error: 'Title and company are required.'
        });
    }

    const sql = `
        INSERT INTO internships
        (title, company, location, duration, stipend,
         description, eligibility, application_link)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title, company, location, duration, stipend,
        description, eligibility, application_link
    ];

    db.run(sql, values, function (err) {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        res.status(201).json({
            message: 'Internship added successfully!',
            internshipId: this.lastID
        });
    });
});


// READ - Get all internships with pagination
router.get('/', (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    if (!Number.isInteger(page) || page < 1 ||
        !Number.isInteger(limit) || limit < 1 || limit > 100) {
        return res.status(400).json({
            error: 'Page must be positive and limit must be between 1 and 100.'
        });
    }

    const offset = (page - 1) * limit;

    db.get('SELECT COUNT(*) AS total FROM internships', (err, count) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        db.all(
            'SELECT * FROM internships ORDER BY id DESC LIMIT ? OFFSET ?',
            [limit, offset],
            (err, rows) => {
                if (err) {
                    return res.status(500).json({
                        error: err.message
                    });
                }

                res.json({
                    page: page,
                    limit: limit,
                    totalRecords: count.total,
                    totalPages: Math.ceil(count.total / limit),
                    internships: rows
                });
            }
        );
    });
});


// READ - Get one internship by ID
router.get('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: 'Invalid internship ID.'
        });
    }

    db.get(
        'SELECT * FROM internships WHERE id = ?',
        [id],
        (err, row) => {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    error: 'Internship not found.'
                });
            }

            res.json(row);
        }
    );
});


// UPDATE - Update an internship by ID
router.put('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: 'Invalid internship ID.'
        });
    }

    const {
        title,
        company,
        location,
        duration,
        stipend,
        description,
        eligibility,
        application_link
    } = req.body;

    if (!title || !company) {
        return res.status(400).json({
            error: 'Title and company are required.'
        });
    }

    const sql = `
        UPDATE internships
        SET title = ?, company = ?, location = ?, duration = ?,
            stipend = ?, description = ?, eligibility = ?,
            application_link = ?
        WHERE id = ?
    `;

    const values = [
        title, company, location, duration, stipend,
        description, eligibility, application_link, id
    ];

    db.run(sql, values, function (err) {
        if (err) {
            return res.status(500).json({
                error: err.message
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                error: 'Internship not found.'
            });
        }

        res.json({
            message: 'Internship updated successfully!'
        });
    });
});


// DELETE - Delete an internship by ID
router.delete('/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            error: 'Invalid internship ID.'
        });
    }

    db.run(
        'DELETE FROM internships WHERE id = ?',
        [id],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    error: 'Internship not found.'
                });
            }

            res.json({
                message: 'Internship deleted successfully!'
            });
        }
    );
});

module.exports = router;
