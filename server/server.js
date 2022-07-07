require('dotenv').config();
const cors = require('cors');
const express = require('express');
const bcrypt = require('bcryptjs');
const connectDB = require('./database/database');
const authRouter = require('./routes/auth.route');
const { isLoggedIn, verifyUser, redirectUser } = require('./middleware/auth');
const Account = require('./model/Account');


// Initialize app
const app = express();
app.use(cors());

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routers
app.use('/api/auth', authRouter);

// // CORS
// app.all('*', (req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     res.header("Access-Control-Allow-Headers", "X-Requested-With");
//     next();
// })

// Routes
app.get('/', (req, res) => {
    res.send("Hello World");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    // Initialize admin account on first run
    try {
        const account = await Account.find();
        if (account.length === 0) {
            try {
                const password = 'admin';
                const hashedPassword = await bcrypt.hash(password, 10);
                const adminAccount = new Account({password: hashedPassword});
                await adminAccount.save();
            } catch(err) {
                console.log(err.message);
            }
        }
    } catch(err) {
        console.log(err.message);
    }
    
    console.log(`Server is running on http://localhost:${PORT}`);
})