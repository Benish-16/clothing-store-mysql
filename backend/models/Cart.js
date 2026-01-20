const mongoose = require("mongoose");
const { Schema } = mongoose;

const CartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
    name: {
    type: String,
    required: true,
    trim: true
  },

  variant: {
    color: {
      type: String,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },

  size: {
    type: String,
    required: true
  },

  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },

  price: {
    type: Number,
    required: true
  }
});

const CartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
    unique: true
  },

  items: [CartItemSchema],

  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Cart", CartSchema);
