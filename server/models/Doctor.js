const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    account_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account'
    },
    patients: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Patient'
    },
    necessities: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Necessity'
    },
});

module.exports = mongoose.model('Doctor', doctorSchema);