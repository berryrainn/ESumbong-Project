const express = require('express');
const mysql = require('mysql2');
const path = require('path'); // Used to handle file paths
const multer = require('multer'); // For handling file uploads (not fully implemented yet)
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// --- SECRET KEY ---
const JWT_SECRET = 'esumbong_password_secret_key_11142025';

// Initialize Express app
const app = express();
const port = 3000;


// These lines let your server read JSON and form data from the frontend
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 


// This tells Express to serve all static files (HTML, CSS, JS, Images)
// from the '../frontend' directory.
app.use(express.static(path.join(__dirname, '..', 'frontend')));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '..', 'frontend', 'uploads');
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueName =  Date.now() + '-' + file.originalname;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage: storage });

// --- Database Connection ---
// Update with your MySQL username and password
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', // Or your MySQL username
    password: 'root', // Your MySQL password
    database: 'barangay_db' // The database you created
});

// Try to connect
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database!');
});


// --- API Endpoints ---
// This endpoint listens for 'POST' requests to '/api/submit-report'
app.post('/api/submit-report', upload.fields([
    { name: 'barangayIdFile', maxCount: 2 }, 
    { name: 'evidenceFiles', maxCount: 7 }   
]), (req, res) => {
    
    const { 
        trackingId, 
        fullname, 
        category, 
        description, 
        priority, 
        address,
        lat,
        lng
    } = req.body;

    const barangayIdPath = req.files.barangayIdFile 
        ? req.files.barangayIdFile.map(file => `uploads/${file.filename}`).join(',') 
        : null;
        
    const evidencePath = req.files.evidenceFiles
        ? req.files.evidenceFiles.map(file => `uploads/${file.filename}`).join(',')
        : null;

    // Call the stored procedure
    const sql = `CALL sp_SubmitReport(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [
        trackingId, 
        fullname, 
        category, 
        description, 
        priority, 
        address, 
        lat, 
        lng,
        barangayIdPath, 
        evidencePath
    ];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error executing stored procedure:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        res.status(200).json({ success: true, message: 'Report submitted!', trackingId: trackingId });
    });
});

// --- GET ALL REPORTS ---
app.get('/api/reports', (req, res) => {
    
    const sql = `CALL sp_GetAllReports()`;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching reports:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        res.status(200).json({ success: true, reports: results[0] });
    });
});

// --- UPDATE REPORT STATUS ---
app.patch('/api/reports/:trackingId/status', (req, res) => {
    
    const { trackingId } = req.params;
    
    const { newStatus } = req.body;

    if (!['Pending', 'In Progress', 'Resolved'].includes(newStatus)) {
        return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    const sql = `CALL sp_UpdateReportStatus(?, ?)`;
    const values = [trackingId, newStatus];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error updating status:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        res.status(200).json({ success: true, message: 'Status updated successfully' });
    });
});

// --- ADMIN LOGIN ---
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username and password are required.' });
    }

    const sql = "SELECT * FROM admins WHERE username = ?";
    
    db.query(sql, [username], async (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results.length === 0) {
            return res.status(401).json({ success: false, message: 'Invalid username or password' });
        }

        const admin = results[0];

        try {
            const isMatch = await bcrypt.compare(password, admin.password_hash);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: 'Invalid username or password' });
            }

            const token = jwt.sign(
                { id: admin.id, username: admin.username }, 
                JWT_SECRET, 
                { expiresIn: '1h' } 
            );
            
            res.status(200).json({ success: true, message: 'Login successful', token: token });

        } catch (error) {
            console.error('Error comparing password:', error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    });
});

// --- GET A SINGLE REPORT BY ID ---
app.get('/api/reports/:trackingId', (req, res) => {
    
    const { trackingId } = req.params;

    const sql = `CALL sp_GetReportByTrackingId(?)`;

    db.query(sql, [trackingId], (err, results) => {
        if (err) {
            console.error('Error fetching report:', err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (results[0].length > 0) {
            res.status(200).json({ success: true, report: results[0][0] });
        } else {
            res.status(404).json({ success: false, message: 'Report not found' });
        }
    });
});

// --- Start the Server Listener ---
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Your frontend should be visible at http://localhost:${port}`);
});