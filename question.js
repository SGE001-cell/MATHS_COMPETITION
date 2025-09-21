const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  category: String, // Junior, Intermediate, Senior
  round: Number,
  questionText: String,
  options: [String],
  correctAnswer: Number, // index of the correct option
});

module.exports = mongoose.model("Question", questionSchema);