const mongoose = require('mongoose');

const incomeStatsSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  income: {
    type: Number,
    required: true,
  },
  expense: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model('IncomeStats', incomeStatsSchema);
