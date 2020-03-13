const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const Volumemodel = new mongoose.Schema({
  start: {
    type: String
  },
  end: {
    type: String
  },
  volume: {
    type: String
  },
  svolume: {
    type: String
  },
  postedBy: { type: ObjectId, ref: "User" },
  createdAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Volume", Volumemodel);
