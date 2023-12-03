const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
  username: {
    required: true,
    type: String,
  },
  cid: {
    required: true,
    type: Number,
    unique: true,
  },
  email: {
    required: true,
    type: String,
    unique: true,
  },
  score: {
    required: true,
    type: String,
  },
});

module.exports = mongoose.model("Result", resultSchema);
