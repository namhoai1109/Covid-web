const jwt = require("jsonwebtoken");
const Account = require("../models/Account");

const authorizeUser = function () {
  return async (req, res, next) => {
    // Get the authorization header token
    try {
      if (req.headers?.authorization?.startsWith("Bearer ")) {
        // Compare the token with the secret
        const token = req.headers.authorization.split("Bearer ")[1];
        const verified = jwt.verify(token, process.env.PS_TOKEN_SECRET);
        const idNumber = verified._id;
        const account = await Account.findOne({ username: idNumber });

        // If the id in the token is not found in the database, return 401
        if (!account) {
          return res
            .status(401)
            .send({ message: "Requesting account not exist!" });
        }

        // Save the user id to the request object for later use
        req.idNumber = idNumber;
        next();
      } else {
        res.status(400).send({ message: "Invalid authorization header" });
      }
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  };
};

module.exports = { authorizeUser };
