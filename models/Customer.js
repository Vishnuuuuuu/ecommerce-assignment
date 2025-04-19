const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  _id: String, // ✅ use UUID as string
  name: String,
  email: String,
  age: Number,
  location: String,
  gender: String
});

module.exports = mongoose.model('Customer', customerSchema);
