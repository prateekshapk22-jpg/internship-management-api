
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const { z } = require('zod');

// ==========================================
// 1. ZOD INPUT VALIDATION SCHEMA
// ==========================================

const internshipSchema = z.object({
    title: z.string()
        .trim()
        .min(1, 'Title is required')
        .max(120, 'Title cannot exceed 120 characters'),

    company: z.string()
        .trim()
        .min(1, 'Company name is required')
        .max(120, 'Company name cannot exceed 120 characters'),

    location: z.string().trim().max(120).nullable().optional(),
    duration: z.string().trim().max(100).nullable().optional(),
    stipend: z.string().trim().max(100).nullable().optional(),
    description: z.string().trim().max(5000).nullable().optional(),
    eligibility: z.string().trim().max(2000).nullable().optional(),

    application_link: z.string()
        .trim()
        .max(2048)
        .refine(value => {
            if (value === '') return true;

            try {
                const url = new URL(value);
                return ['http:', 'https:'].includes(url.protocol);
            } catch {
                return false;
            }
        }, 'Enter a valid HTTP or HTTPS application URL')
        .nullable()
        .optional()
});

// ==========================================
// 2. VALIDATION MIDDLEWARE
// ==========================================

function validateInternship(req, res, next) {
    const result = internshipSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json({
            success: false,
            message: 'Input validation failed',
            errors: result.error.issues.map(issue => ({
                field: issue.path.join('.'),
                message: issue.message
            }))
        });
    }

    req.validatedBody = result.data;
    next();
}

// ==========================================
// 3. CREATE - ADD NEW INTERNSHIP
// ==========================================

router.post('/', validateInternship, (req, res) => {

    const {
        title,
        company,
        location,
        duration,
        stipend,
        description,
        eligibility,
        application_link
    } = req.validatedBody;

    const sql = `
        INSERT INTO internships
        (title, company, location, duration, stipend,
         description, eligibility, application_link)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        title,
        company,
        location ?? null,
        duration ?? null,
        stipend ?? null,
        description ?? null,
        eligibility ?? null,
        application_link ?? null
    ];

    db.run(sql, values, function (err) {
        if (err) {
            console.error('Create internship error:', err.message);

            return res.status(500).json({
                success: false,
                message: 'Unable to create internship'
            });
        }

        res.status(201).json({
            success: true,
            message: 'Internship added successfully!',
            internshipId: this.lastID
        });
    });
});

// ==========================================
// 4. READ - GET ALL INTERNSHIPS
// WITH PAGINATION
// ==========================================

router.get('/', (req, res) => {

    const page = req.query.page === undefined
        ? 1 : Number(req.query.page);

    const limit = req.query.limit === undefined
        ? 5 : Number(req.query.limit);

    if (
        !Number.isInteger(page) || page < 1 ||
        !Number.isInteger(limit) || limit < 1 || limit > 100
    ) {
        return res.status(400).json({
            success: false,
            message: 'Page must be positive and limit must be between 1 and 100'
        });
    }

    const offset = (page - 1) * limit;

    db.get(
        'SELECT COUNT(*) AS total FROM internships',
        (err, count) => {

            if (err) {
                console.error('Count error:', err.message);

                return res.status(500).json({
                    success: false,
                    message: 'Unable to retrieve internships'
                });
            }

            db.all(
                `SELECT * FROM internships
                 ORDER BY id DESC
                 LIMIT ? OFFSET ?`,
                [limit, offset],
                (err, rows) => {

                    if (err) {
                        console.error('Read internships error:', err.message);

                        return res.status(500).json({
                            success: false,
                            message: 'Unable to retrieve internships'
                        });
                    }

                    res.status(200).json({
                        success: true,
                        page,
                        limit,
                        totalRecords: count.total,
                        totalPages: Math.ceil(count.total / limit),
                        internships: rows
                    });
                }
            );
        }
    );
});

// ==========================================
// 5. READ - GET INTERNSHIP BY ID
// ==========================================

router.get('/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: 'Invalid internship ID'
        });
    }

    db.get(
        'SELECT * FROM internships WHERE id = ?',
        [id],
        (err, row) => {

            if (err) {
                console.error('Get internship error:', err.message);

                return res.status(500).json({
                    success: false,
                    message: 'Unable to retrieve internship'
                });
            }

            if (!row) {
                return res.status(404).json({
                    success: false,
                    message: 'Internship not found'
                });
            }

            res.status(200).json({
                success: true,
                internship: row
            });
        }
    );
});

// ==========================================
// 6. UPDATE - UPDATE INTERNSHIP
// ==========================================

router.put('/:id', validateInternship, (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: 'Invalid internship ID'
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
    } = req.validatedBody;

    const sql = `
        UPDATE internships
        SET title = ?,
            company = ?,
            location = ?,
            duration = ?,
            stipend = ?,
            description = ?,
            eligibility = ?,
            application_link = ?
        WHERE id = ?
    `;

    const values = [
        title,
        company,
        location ?? null,
        duration ?? null,
        stipend ?? null,
        description ?? null,
        eligibility ?? null,
        application_link ?? null,
        id
    ];

    db.run(sql, values, function (err) {

        if (err) {
            console.error('Update internship error:', err.message);

            return res.status(500).json({
                success: false,
                message: 'Unable to update internship'
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: 'Internship not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Internship updated successfully!'
        });
    });
});

// ==========================================
// 7. DELETE - DELETE INTERNSHIP
// ==========================================

router.delete('/:id', (req, res) => {

    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
        return res.status(400).json({
            success: false,
            message: 'Invalid internship ID'
        });
    }

    db.run(
        'DELETE FROM internships WHERE id = ?',
        [id],
        function (err) {

            if (err) {
                console.error('Delete internship error:', err.message);

                return res.status(500).json({
                    success: false,
                    message: 'Unable to delete internship'
                });
            }

            if (this.changes === 0) {
                return res.status(404).json({
                    success: false,
                    message: 'Internship not found'
                });
            }

            res.status(200).json({
                success: true,
                message: 'Internship deleted successfully!'
            });
        }
    );
});

// ==========================================
// 8. EXPORT ROUTER
// ==========================================

module.exports = router;
