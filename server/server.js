require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./database/database');
const authRouter = require('./routes/auth.route');
const { isLoggedIn, verifyUser, redirectUser } = require('./middleware/auth');


// Initialize app
const app = express();
app.use(cors());

connectDB();

// Middleware
app.use(express.json());
app.use('/auth', authRouter);
app.use(isLoggedIn);

// CORS
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})

// Routes
app.get('/', redirectUser, (req, res) => {
    res.send("Logged in");
});

app.get('/admin', verifyUser('admin'), (req, res) => {
    res.send("Logged in as admin");
})

app.get('/doctor', verifyUser('doctor'), (req, res) => {
    res.send("Logged in as moderator");
})

app.get('/patient', verifyUser('patient'), (req, res) => {
    res.send("Logged in as patient");
})

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})