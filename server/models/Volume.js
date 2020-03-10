const mongoose = require("mongoose");

const Volume = new mongoose.Schema({
  title: {
    type: String,
    required: "Title is required"
  },

  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Volume", Volume);
