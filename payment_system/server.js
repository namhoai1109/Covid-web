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
const sharedRouter = require("./routes/shared.route");

// Connect to database
connectDB();

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRouter);
app.use("/api/main", mainRouter);
app.use("/api/shared", sharedRouter);

const httpsOptions = {
  key: fs.readFileSync("./ssl/key.pem"),
  cert: fs.readFileSync("./ssl/cert.pem"),
};

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;
const PORT = process.env.PAYMENT_SYSTEM_PORT || 9000;
https.createServer(httpsOptions, app).listen(PORT, () => {
  // initAdmin();
  console.log(`Server is running on https://localhost:${PORT}`);
});

// app.listen(PORT, () => {
//   initAdmin();
//   console.log(`Server is running on http://localhost:${PORT}`);
// })