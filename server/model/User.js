const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'doctor', 'patient']
    },
    username: {
        type: String,
        max: 1024,
        required: true,
    },
    password: {
        type: String,
        min: 6,
        max: 1024,
        required: true
    }
});

module.exports = mongoose.model('User', userSchema);