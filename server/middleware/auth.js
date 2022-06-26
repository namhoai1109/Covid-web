const jwt = require("jsonwebtoken");
const User = require("../model/User");

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

const verifyUser = function (role) {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id);
            if (user.role !== role) {
                return res.status(401).send("You are not authorized to perform this action.");
            }
            next();
        } catch (err) {
            res.status(400).send(err);
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
