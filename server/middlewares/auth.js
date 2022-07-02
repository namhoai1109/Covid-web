const jwt = require("jsonwebtoken");
const Account = require("../models/Account");

// const isLoggedIn = function (req, res, next) {
//   const token = req.header("auth-token");
//   if (!token) {
//     return res.status(401).send("You are not logged in.");
//   }
//   try {
//     const verified = jwt.verify(token, process.env.TOKEN_SECRET);
//     req.user = verified;
//     next();
//   } catch (err) {
//     res.status(400).send(err);
//   }
// };

const authorizeUser = function (...roles) {
  return async (req, res, next) => {
    // Get the authorization header token
    try {
      if (req.headers?.authorization?.startsWith("Bearer ")) {
        const token = req.headers.authorization.split("Bearer ")[1];
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const accountID = verified._id;
        const account = await Account.findById(accountID);

        // If the id in the token is not found in the database, return 401
        if (!account) {
          return res.status(401).send({ message: "Requesting account not exist!" });
        }

        // Check if the user has the correct role and is active
        if (roles.includes(account.role)) {
          if (account.status === "active") {
            next();
          } else {
            return res.status(401).send({ message: "Account is disabled!" });
          }
        } else {
          return res.status(401).send({ message: "Permission denied!" });
        }
      } else {
        res.status(400).send({ message: "Invalid authorization header" });
      }
    } catch (err) {
      res.status(400).send(err);
    }
  };
};

module.exports = { authorizeUser };
