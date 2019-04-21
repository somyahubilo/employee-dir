const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

var ActivitySchema = new mongoose.Schema({
  userId: {
    type: String,
    trim: true,
    required: true
  },
  customerId:{
    type:String,
    unique : true
  },
  activityType: {
    type: String,
    trim: true,
    required: true,
    // unique: true
  },
  description: {
    type: String,
    trim: true,
  },
  nextdescription: {
    type: String,
    trim: true,
  },
  nextactivitytime: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

var Activity = mongoose.model("activity", ActivitySchema);

module.exports = { Activity };