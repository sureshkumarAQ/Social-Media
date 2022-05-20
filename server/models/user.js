const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require("validator");

var schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: true,
  },
});

// Hash password using bcrypt
schema.pre("save", async function (next) {
  const salt = await bcrypt.genSalt();
  let newPassword = this.password.toString();
  this.password = await bcrypt.hash(newPassword, salt);
  next();
});

const User = mongoose.model("user", schema);

module.exports = User;
