const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  account_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  time: {
    type: Date,
    immutable: true,
    default: Date.now
  }
});

module.exports = mongoose.model('Log', logSchema);