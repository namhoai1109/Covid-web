const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
  }
});

module.exports = mongoose.model('Admin', adminSchema);