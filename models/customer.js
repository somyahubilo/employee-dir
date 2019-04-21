const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true
  },
  email: {
    type: String,
    trim: true,
    required: true,
    unique: true
  },
  phone: {
    type: String,
    trim: true,
    required: true,
    // unique: true
  },
  address: {
    type: String,
    trim: true,
  },
  status:{
    type:String
  },
  customerId:{
    type:String,
    unique : true
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

var Customer = mongoose.model("customer", CustomerSchema);

module.exports = { Customer };