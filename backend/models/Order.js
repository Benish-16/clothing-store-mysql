const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  customer: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    apartment: String,
    city: String,
    state: String,
    pin: String,
    country: { type: String, default: "India" }
  },
  cartItems: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
      name: { type: String, required: true, trim: true },
      variant: {
        color: { type: String, required: true },
        image: { type: String, required: true }
      },
      size: { type: String, required: true },
      quantity: { type: Number, required: true, min: 1, default: 1 },
      price: { type: Number, required: true }
    }
  ],
  subtotal: Number,
  shippingCost: Number,
  deliveryType: String,
  total: Number,
  paymentMethod: { type: String, default: "Card" },
  paymentStatus: { type: String, default: "Pending" },
  orderStatus: { type: String, default: "Pending" }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);

