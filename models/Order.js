const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id: String, // ✅ UUID as string
  customerId: {
    type: String, // ✅ MUST be String
    ref: 'Customer'
  },
  products: [
    {
      productId: {
        type: String, // ✅ UUID as string
        ref: 'Product'
      },
      quantity: Number,
      priceAtPurchase: Number
    }
  ],
  totalAmount: Number,
  orderDate: Date,
  status: String
});

module.exports = mongoose.model('Order', orderSchema);
