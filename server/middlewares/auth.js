const jwt = require("jsonwebtoken");
const Account = require("../models/Account");

const authorizeUser = function (...roles) {
  return async (req, res, next) => {
    // Get the authorization header token
    try {
      if (req.headers?.authorization?.startsWith("Bearer ")) {
        // Compare the token with the secret
        const token = req.headers.authorization.split("Bearer ")[1];
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        const idNumber = verified._id;
        const account = await Account.findOne({ username: idNumber });

        // If the id in the token is not found in the database, return 401
        if (!account) {
          return res
            .status(401)
            .send({ message: "Requesting account not exist!" });
        }

        // Check if the user has the correct role and is active
        if (roles.includes(account.role)) {
          if (account.status === "active") {
            // Save the user id to the request object for later use
            req.idNumber = idNumber;
            next();
          } else {
            return res.status(401).send({ message: "Account is disabled, please contact your administrator" });
          }
        } else {
          return res.status(401).send({ message: "Permission denied!" });
        }
      } else {
        res.status(400).send({ message: "Invalid authorization header" });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };
};

// If account is not linked to payment system, return 401, to prevent user from buying without linking
const checkLinkedAccount = async function (req, res, next) {
  try {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      // Compare the token with the secret
      const token = req.headers.authorization.split("Bearer ")[1];
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      const idNumber = verified._id;
      const account = await Account.findOne({ username: idNumber });

      // If the id in the token is not found in the database, return 401
      if (!account) {
        return res
          .status(401)
          .send({ message: "Requesting account not exist!" });
      }

      if (!account.linked) {
        return res.status(401).send({
          message: "Your account is not linked to payment system, please link your account to payment system",
        })
      }

      req.idNumber = idNumber;
      next();
    }
  }
  catch (err) {
    res.status(400).send(err);
  }
}

// If account is linked to payment system, return 401, to prevent user from linking again
const checkPaymentAccountExist = async function (req, res, next) {
  try {
    if (req.headers?.authorization?.startsWith("Bearer ")) {
      // Compare the token with the secret
      const token = req.headers.authorization.split("Bearer ")[1];
      const verified = jwt.verify(token, process.env.TOKEN_SECRET);
      const idNumber = verified._id;
      const account = await Account.findOne({ username: idNumber });

      // If the id in the token is not found in the database, return 401
      if (!account) {
        return res
          .status(401)
          .send({ message: "Requesting account not exist!" });
      }

      if (account.linked) {
        return res.status(400).send({
          message: "Your account is already linked to payment system",
        })
      }

      req.idNumber = idNumber;
      next();
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
}

module.exports = { authorizeUser, checkLinkedAccount, checkPaymentAccountExist };
