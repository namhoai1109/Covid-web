const router = require('express').Router();
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
        name: req.body.name,
        role: req.body.role,
        username: req.body.username,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save();
        res.send(savedUser);
    } catch(err){
        res.status(400).send(err);
    }
})

router.post('/login', async(req, res) => {
    try {
        const user = await User.findOne({username: req.body.username});
        if(!user){
            return res.status(401).send({ message: 'Invalid username or password' });
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if(!isPasswordMatch){
            return res.status(401).send({ message: 'Invalid username or password' });
        }

        // Assign a new token to the user
        const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
        res.status(200).send({_id: user._id, token: token});
    } catch(err){
        res.status(400).send(err)
    }
})

module.exports = router;