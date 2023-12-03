const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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
  role: {
    required: true,
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  password: {
    required: true,
    type: String,
  }
  // No need for 'password' field here
});

module.exports = mongoose.model("User", userSchema);
