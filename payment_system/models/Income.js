const mongoose = require('mongoose');

const incomeSchema = new mongoose.Schema({
    date: {
        type: String,
        required: true,
    },
    income: {
        type: Number,
        required: true,
    },
    expense: {
        type: Number,
        required: true,
    },
});

module.exports = mongoose.model('Income', incomeSchema);
