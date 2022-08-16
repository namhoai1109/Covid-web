require("dotenv").config();
const express = require("express");
const bcrypt = require("bcrypt");
const connectDB = require("./database/database");
const cors = require("cors");
const https = require("https");
const fs = require("fs");
// Models
const Account = require("./models/Account");
// Routers
const authRouter = require("./routes/auth.route");
const mainRouter = require("./routes/main.route");

// Connect to database
connectDB();

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use('/api/main', mainRouter);

// Initialize admin account on first setup
const initAdmin = async () => {
  try {
    const account = await Account.find();
    if (account.length === 0) {
      const password = "admin";
      const hashedPassword = await bcrypt.hash(password, 10);
      const adminAccount = new Account({
        username: "000000000",
        password: hashedPassword,
        balance: 0,
      });
      await adminAccount.save();
    }
  } catch (err) {
    console.log(err.message);
  }
}

const httpsOptions = {
  key: fs.readFileSync("./ssl/key.pem"),
  cert: fs.readFileSync("./ssl/cert.pem"),
}

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const PORT = process.env.PAYMENT_SYSTEM_PORT || 9000;
https.createServer(httpsOptions, app).listen(PORT, () => {
  initAdmin();
  console.log(`Server is running on https://localhost:${PORT}`);
});

// app.listen(PORT, () => {
//   initAdmin();
//   console.log(`Server is running on http://localhost:${PORT}`);
// })