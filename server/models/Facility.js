const mongoose = require("mongoose");

const facilitySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    capacity: {
        type: Number,
        required: true,
        validate: {
            validator: (v) => Number.isInteger(v) && v > 0,
            message: (props) => `${props.value} is not a valid capacity`,
        },
    },
    current_count: {
        type: Number,
        required: true,
        validate: {
            validator: (v) => Number.isInteger(v) && v >= 0,
            message: (props) => `${props.value} is not a valid capacity`,
        },
    },
    location: {
        formattedAddress: { type: String },
        province: { type: String, required: true, },
        district: { type: String, required: true, },
        ward: { type: String, required: true, }
    },
});


module.exports = mongoose.model("Facility", facilitySchema);