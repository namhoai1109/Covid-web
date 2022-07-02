require("dotenv").config();
const express = require("express");
const connectDB = require("./database/database");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const fs = require("fs");
const https = require("https");
// Import routes
const authRouter = require("./routes/auth.route");
const adminRouter = require("./routes/admin.route");
// Middlewares
const { authorizeUser } = require("./middlewares/auth");
// Models
const Account = require("./models/Account");
const Admin = require("./models/Admin");


// Initialize app
const app = express();
app.use(cors());

connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Mount routers
app.use("/api/auth", authRouter);
app.use("/api/admin", authorizeUser("admin"), adminRouter);

// CORS
app.all('*', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
})

// Routes
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Initialize admin account on first setup
const initAdmin = async () => {
  try {
    const account = await Account.find();
    if (account.length === 0) {
      try {
        // Create admin count
        const password = "admin";
        const hashedPassword = await bcrypt.hash(password, 10);
        const adminAccount = new Account({ password: hashedPassword });
        await adminAccount.save();

        // Create admin
        const admin = new Admin({
          account_id: adminAccount._id,
        });
        await admin.save();
      } catch (err) {
        console.log(err.message);
      }
    }
  } catch (err) {
    console.log(err.message);
  }
};

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  initAdmin();
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Start server
// https.createServer({
//     key: fs.readFileSync("./key/key.pem"),
//     cert: fs.readFileSync("./key/cert.pem"),
// }, app)
//     .listen(PORT, async function () {
//         try {
//             const account = await Account.find();
//             if (account.length === 0) {
//                 try {
//                     const password = 'admin';
//                     const hashedPassword = await bcrypt.hash(password, 10);
//                     const adminAccount = new Account({ password: hashedPassword });
//                     await adminAccount.save();
//                 } catch (err) {
//                     console.log(err.message);
//                 }
//             }
//         } catch (err) {
//             console.log(err.message);
//         }

//         console.log(`Server is running on http://localhost:${PORT}`);
//     });
