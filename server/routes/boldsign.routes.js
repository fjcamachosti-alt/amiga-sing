
const express = require('express');
const router = express.Router();
const multer = require('multer');
const FormData = require('form-data');
const axios = require('axios'); // Assuming axios is installed, or use node-fetch
const fs = require('fs');
const os = require('os');

// Configure Multer to handle file uploads in memory or temporary disk
const upload = multer({ dest: os.tmpdir() });

const BOLDSIGN_API_KEY = process.env.BOLDSIGN_API_KEY;
const BOLDSIGN_API_URL = 'https://api.boldsign.com/v1';

// Middleware to check API Key
const checkApiKey = (req, res, next) => {
    if (!BOLDSIGN_API_KEY) {
        return res.status(500).json({ message: 'BoldSign API Key not configured in server' });
    }
    next();
};

// GET /api/boldsign/list - List documents
router.get('/list', checkApiKey, async (req, res) => {
    try {
        const response = await axios.get(`${BOLDSIGN_API_URL}/document/list`, {
            headers: {
                'X-API-KEY': BOLDSIGN_API_KEY
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error('BoldSign Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error fetching documents from BoldSign' });
    }
});

// POST /api/boldsign/send - Send document for signature
router.post('/send', checkApiKey, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
        const { title, message, signerName, signerEmail } = req.body;

        const form = new FormData();
        form.append('Title', title);
        form.append('Message', message);
        form.append('Signers[0][Name]', signerName);
        form.append('Signers[0][EmailAddress]', signerEmail);
        form.append('Signers[0][SignerType]', 'Signer');
        form.append('Files', fs.createReadStream(req.file.path));

        const response = await axios.post(`${BOLDSIGN_API_URL}/document/send`, form, {
            headers: {
                ...form.getHeaders(),
                'X-API-KEY': BOLDSIGN_API_KEY
            }
        });

        // Cleanup temp file
        fs.unlinkSync(req.file.path);

        res.json(response.data);

    } catch (error) {
        // Cleanup temp file in case of error
        if (req.file) fs.unlinkSync(req.file.path);
        
        console.error('BoldSign Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error sending document via BoldSign' });
    }
});

module.exports = router;
