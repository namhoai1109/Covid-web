const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  }
});

module.exports = mongoose.model('Doctor', doctorSchema);