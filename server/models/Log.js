const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  account: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  time: {
    type: Date,
    immutable: true,
    default: Date.now
  },
  action: {
    type: String,
  }
});

module.exports = mongoose.model('Log', logSchema);