const mongoose = require("mongoose");

const SizeSchema = new mongoose.Schema({
  size: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  }
});

const VariantSchema = new mongoose.Schema({
  color: {
    type: String,
    required: true
  },
  images: {
    type: String,
    required: true
  },
  sizes: {
    type: [SizeSchema],
    required: true
  }
});

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ["Men", "women", "Child"],
    required: true
  },
  type: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "Type",
  required: true
},
  variants: {
    type: [VariantSchema],
    required: true
  },
  
});

module.exports = mongoose.model("Product", ProductSchema);
