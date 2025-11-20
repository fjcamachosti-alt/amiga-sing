
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../db'); // Assuming DB connection is available

// Configure Multer
const uploadDir = path.join(__dirname, '../uploads/signatures');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// POST /api/signatures/upload
router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const { originalName, signedBy, signedDate } = req.body;

        // In a real DB implementation:
        /*
        const query = `INSERT INTO signed_documents (original_name, signed_name, signed_date, signed_by, file_path) VALUES ($1, $2, $3, $4, $5) RETURNING *`;
        const values = [originalName, req.file.filename, signedDate, signedBy, req.file.path];
        const result = await db.query(query, values);
        res.json(result.rows[0]);
        */

        // For Mock/Demo purposes, just return success with file info
        res.json({
            success: true,
            file: req.file.filename,
            originalName,
            signedBy
        });

    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).json({ message: 'Error saving signed document' });
    }
});

module.exports = router;
