const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  questions: [],
  timeLimit:{
    type: Number,
    required: true,
  },
  startTime:{
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Quiz", quizSchema);
