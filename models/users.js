const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var UserSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    // required: true
  },
  emailAddress: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  phoneNumber: {
    type: String,
    trim: true,
    // required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

UserSchema.pre("save", function (next) {
  var user = this;
  if (user.isModified("password")) {
    bcrypt.genSalt(5, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

var User = mongoose.model("Users", UserSchema);

module.exports = { User };