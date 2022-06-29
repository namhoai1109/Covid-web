const jwt = require("jsonwebtoken");
const User = require("../model/User");
const Account = require("../model/Account");

const isLoggedIn = function (req, res, next) {
    const token = req.header("auth-token");
    if (!token) {
        return res.status(401).send("You are not logged in.");
    }
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).send(err);
    }
};

const verifyUser = function(...roles) {
    return async (req, res, next) => {
        // Get the authorization header token
        if (req.headers.authorization.startsWith("Bearer ")) {
            const token = req.headers.authorization.split("Bearer ")[1];
            const verified = jwt.verify(token, process.env.TOKEN_SECRET);
            const accountID = verified._id;

            try {
                const account = await Account.findById(accountID);

                // If the id in the token is not found in the database, return 401
                if (!account) {
                    res.status(401).send({ message: "Invalid token" });
                }

                // Check if the user has the correct role
                if (roles.includes(account.role)) {
                    next();
                } else {
                    res.status(401).send({ message: "You are not authorized to access this page." });
                }
            } catch (err) {
                res.status(400).send(err);
            }
        } else {
            res.status(400).send({ message: "Invalid authorization header" });
        }   
    };
};

const redirectUser = async function (req, res, next) {
    try {
        const user = await User.findById(req.user._id);
        if (user.role === "admin") {
            res.redirect("/admin");
        } else if (user.role === "doctor") {
            res.redirect("/doctor");
        } else {
            res.redirect("/patient");
        }
    } catch(err) {
        res.status(400).send(err);
    }
}

module.exports = { isLoggedIn, verifyUser, redirectUser };
