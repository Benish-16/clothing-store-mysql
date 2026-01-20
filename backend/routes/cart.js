const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const fetchuser = require("../middleware/fetchuser");
router.post("/addcart", fetchuser, async (req, res) => {
  try {
    const { productId, color, image, size, price, quantity } = req.body;

    if (!productId || !color || !size || !price || !quantity) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    if (![1, -1].includes(quantity)) {
      return res.status(400).json({ success: false, message: "Invalid quantity" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const variant = product.variants.find(
      v => v.color.toLowerCase() === color.toLowerCase()
    );
    if (!variant) {
      return res.status(400).json({ success: false, message: "Color not available" });
    }

    const sizeObj = variant.sizes.find(
      s => s.size.toLowerCase() === size.toLowerCase()
    );
    if (!sizeObj) {
      return res.status(400).json({ success: false, message: "Size not available" });
    }

    let cart = await Cart.findOne({ user: req.user.id });
    if (!cart) cart = new Cart({ user: req.user.id, items: [] });

    const existingItem = cart.items.find(
      item =>
        item.product.equals(productId) &&
        item.variant.color.toLowerCase() === color.toLowerCase() &&
        item.size.toLowerCase() === size.toLowerCase()
    );

   
    if (quantity === 1) {
      if (sizeObj.quantity < 1) {
        return res.status(400).json({ success: false, message: "Out of stock" });
      }

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          product: productId,
          variant: { color, image },
          size,
          quantity: 1,
          price,
          name: product.name,
        });
      }

      sizeObj.quantity -= 1;
    }

 
    if (quantity === -1 && existingItem) {
      existingItem.quantity -= 1;
      sizeObj.quantity += 1;

      if (existingItem.quantity <= 0) {
        cart.items = cart.items.filter(i => i !== existingItem);
      }
    }

    await cart.save();
    await product.save();

    res.json({ success: true, cart });

  } catch (error) {
    console.error("ADD CART ERROR:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


router.get("/fetchcart", fetchuser, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart) {
      return res.status(200).json({
        success: true,
        items: []
      });
    }

    res.status(200).json({
      success: true,
      items: cart.items,
     
    });

  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});
router.delete("/removecart", fetchuser, async (req, res) => {
  try {
    const { productId, color, size } = req.body;

    const cart = await Cart.findOne({ user: req.user.id });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });


    const cartItem = cart.items.find(
      item =>
        item.product.toString() === productId &&
        item.variant.color.toLowerCase() === color.toLowerCase() &&
        item.size.toLowerCase() === size.toLowerCase()
    );

    if (!cartItem) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    const variant = product.variants.find(v => v.color.toLowerCase() === color.toLowerCase());
    if (variant) {
      const sizeObj = variant.sizes.find(s => s.size.toLowerCase() === size.toLowerCase());
      if (sizeObj) {
        sizeObj.quantity += cartItem.quantity; 
      }
    }

    
    cart.items = cart.items.filter(
      item =>
        !(
          item.product.toString() === productId &&
          item.variant.color.toLowerCase() === color.toLowerCase() &&
          item.size.toLowerCase() === size.toLowerCase()
        )
    );

    await cart.save();
    await product.save();
    await cart.populate("items.product");

    res.json({ success: true, cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
