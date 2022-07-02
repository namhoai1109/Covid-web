const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'


    },
    doctors: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Doctor'

    },
    facilities: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Facility'
    },
});

module.exports = mongoose.model('Admin', adminSchema);