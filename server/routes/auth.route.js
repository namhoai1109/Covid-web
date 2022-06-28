const router = require('express').Router();
const Account = require('../model/Account');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyUser } = require('../middleware/auth');

router.post('/register', verifyUser('admin', 'doctor'), async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const account = new Account({
        username: req.body.username,
        password: hashedPassword,
        role: req.body.role,
        status: req.body.status
    })
    try {
        const savedAccount = await account.save();
        res.send(savedAccount);
    } catch(err){
        res.status(400).send(err.message);
    }
})

router.post('/login', async(req, res) => {
    try {
        const account = await Account.findOne({ username: req.body.username });
        if (!account) {
            return res.status(401).send({ message: "Invalid username or password"});
        }
        const isMatch = await bcrypt.compare(req.body.password, account.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid username or password"});
        }

        // Create a token
        const token = jwt.sign({ _id: account._id }, process.env.TOKEN_SECRET);
        res.send({ token: token});
    } catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;