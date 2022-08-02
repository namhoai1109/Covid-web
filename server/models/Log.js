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
    enum: ['login', 'logout', 'create', 'update', 'delete', 'checkout'],
  },
  description: {
    type: String,
  }
});

module.exports = mongoose.model('Log', logSchema);