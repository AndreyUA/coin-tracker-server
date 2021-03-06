const mongoose = require("mongoose");

// Here I'll create the main model of family
// Family name, email, pass, MEMBERS, total(money), etc

const FamilySchema = new mongoose.Schema({
  familyName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  persons: [
    {
      name: {
        type: String,
        required: true,
      },
      date: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Family = mongoose.model("family", FamilySchema);
