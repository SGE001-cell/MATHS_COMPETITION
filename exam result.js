const mongoose = require("mongoose");

const examResultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  category: String,
  round: Number,
  score: Number,
  takenAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ExamResult", examResultSchema);