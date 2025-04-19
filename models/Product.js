const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: String, // ✅ UUID
  name: String,
  category: String,
  price: Number,
  stock: Number
});

module.exports = mongoose.model('Product', productSchema);
