const mongoose = require('mongoose');

const facilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    capacity: {
        type: Number,
        required: true,
        unique: true,
    },
    current_count: {
        type: Number,
        required: true,
        unique: true,
    }
});

module.exports = mongoose.model('Facility', facilitySchema);