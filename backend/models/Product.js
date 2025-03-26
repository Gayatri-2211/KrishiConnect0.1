const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  description: { type: String, required: true },
  contact: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  imageUrl: { type: String, required: true },
  quantity: { type: String, required: true },
  manufacturedDate: { type: Date, required: true },
  deliveryOptions: { type: [String], required: true },
  qualityGrade: { type: String, required: true },
  sellerName: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);
