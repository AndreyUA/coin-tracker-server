const mongoose = require("mongoose");

const BudgetScema = new mongoose.Schema({
  // TODO: add id of creator

  total: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isClosed: {
    type: Boolean,
    default: false,
  },
  transactions: [
    {
      // TODO: add person!!!
      money: {
        type: Number,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

module.exports = Budget = mongoose.model("Budget", BudgetScema);
