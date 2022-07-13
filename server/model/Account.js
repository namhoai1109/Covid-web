const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        min: 9, //CMND
        max: 11, //CCCD
        validate: {
            validator: v => /^\d+$/.test(v),  // only digits
            message: props => `${props.value} is not a valid id number`
        },
        default: '000000000'
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ['admin', 'doctor', 'patient'],
        default: 'admin'
    },
    status: {
        type: String,
        required: true,
        enum: ['active', 'inactive'],
        default: 'active'
    }
});

module.exports = mongoose.model('Account', accountSchema);