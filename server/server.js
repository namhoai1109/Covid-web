require("dotenv").config();
const express = require("express");
const connectDB = require("./database/database");
const bcrypt = require("bcryptjs");
const cors = require("cors");
// Import routes
const authRouter = require("./routes/auth.route");
const adminRouter = require("./routes/admin.route");
const doctorRouter = require("./routes/doctor.route");
const facilityRouter = require("./routes/facility.route");
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
app.use(express.static("public"));
app.use("/images", express.static("images"));

// Mount routers
app.use("/api/auth", authRouter);
app.use("/api/admin", authorizeUser("admin"), adminRouter);
app.use("/api/doctor", authorizeUser("doctor"), doctorRouter);
app.use("/api/facility", authorizeUser("admin"), facilityRouter);

// Initialize admin account on first setup
const initAdmin = async() => {
    try {
        const account = await Account.find();
        if (account.length === 0) {
            try {
                // Create admin acount
                const password = "admin";
                const hashedPassword = await bcrypt.hash(password, 10);
                const adminAccount = new Account({
                    username: "000000000",
                    password: hashedPassword,
                    role: "admin",
                });
                await adminAccount.save();

                // Create admin
                const admin = new Admin({
                    account: adminAccount._id,
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