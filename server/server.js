require('dotenv').config();
const cors = require('cors');
const express = require('express');
const connectDB = require('./database/database');
const authRouter = require('./routes/auth.route');
const { isLoggedIn, verifyUser, redirectUser } = require('./middleware/auth');

// Initialize app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/auth', authRouter);
app.use(isLoggedIn);

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