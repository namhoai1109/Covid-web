const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
        unique: true,
    },
    income: {
        type: Number,
        required: true,
        default: 0,
    },
    expense: {
        type: Number,
        required: true,
        default: 0,
    },
});

module.exports = mongoose.model('Income', incomeSchema);
