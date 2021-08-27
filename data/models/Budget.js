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
  name: {
    type: String,
    require: true,
  },
  transactions: [
    {
      person: {
        type: String,
        required: true,
      },
      purchase: {
        type: String,
        required: true,
      },
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
