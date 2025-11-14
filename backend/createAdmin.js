const mysql = require('mysql2');
const bcrypt = require('bcrypt');

// --- CONFIGURE THIS ---
const newUsername = 'admin';
const newPassword = 'password123';
// ----------------------

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'barangay_db'
});

// Hash the password
bcrypt.hash(newPassword, 10, (err, hash) => {
    if (err) {
        console.error('Error hashing password:', err);
        return;
    }
    
    console.log('Hashed password:', hash);
    
    // Connect to DB and insert
    db.connect(err => {
        if (err) return console.error('Error connecting:', err);
        
        const sql = "INSERT INTO admins (username, password_hash) VALUES (?, ?)";
        
        db.query(sql, [newUsername, hash], (err, result) => {
            if (err) {
                console.error('Error creating admin:', err.message);
            } else {
                console.log(`Successfully created admin user '${newUsername}'!`);
            }
            db.end();
        });
    });
});