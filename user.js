const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: String,
  middleName: String,
  lastName: String,
  school: String,
  state: String,
  lga: String,
  phone: String,
  email: { type: String, unique: true },
  password: String, // hashed password
  category: String,
  dob: Date,
  earlyBird: String,
  profilePic: { type: String, default: "" },
  registeredAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);