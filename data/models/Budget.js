const mongoose = require("mongoose");

const BudgetScema = new mongoose.Schema({
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "families",
    required: true,
  },
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
