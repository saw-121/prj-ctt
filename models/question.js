const mongoose = require("mongoose");

var currentDate = new Date();
var currentYear = currentDate.getFullYear();

const questionSchema = new mongoose.Schema({
  question: {
    required: true,
    type: String,
  },
  options: {
    required: true,
    type: [String],
  },
  correctOption: {
    required: true,
    type: String,
  },
  difficulty: {
    required: true,
    type: String,
  },
  year: {
    required: true,
    type: String,
    default: currentYear
  }
});

module.exports = mongoose.model("Question", questionSchema);
