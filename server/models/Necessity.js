const mongoose = require('mongoose')

const necessitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    price: {
        type: Number,
        required: true,
        unique: true,
    },
    quantity_unit: {
        type: String,
        required: true,
        unique: true,
    },
    images: {
        type: [String],
        required: true,
        unique: true,
    },
})

module.exports = mongoose.model('Necessity', necessitySchema)