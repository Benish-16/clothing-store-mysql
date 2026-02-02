const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
router.post("/addcart", fetchuser, async (req, res) => {
  try {

    const userId = req.user_id;   

    const {
      productId,
   
      color,
      image,
      size,
      quantity,
      price
    } = req.body;
const variantImage = Array.isArray(image) ? image[0] : image;


   if (!productId || !color || !size || !price || !quantity) {

      return res.status(400).json({ success: false, message: "Missing fields" });
    }
const [p] = await pool.query(
  "SELECT name FROM products WHERE id = ?",
  [productId]
);

const productName = p[0].name;
    await pool.execute(
      "CALL add_to_cart(?,?,?,?,?,?,?,?)",
      [
        userId,
        productId,
     productName ,
        color,
       variantImage,
        size,
      Number(quantity),
    Number(price)
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("ADD CART ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


router.get("/fetchcart", fetchuser, async (req, res) => {
  try {

    const userId = req.user_id;   

    const [rows] = await pool.execute(
      "CALL fetch_cart(?)",
      [userId]
    );

    const items = rows[0] || [];

    res.json({
      success: true,
      items
    });

  } catch (err) {
    console.error("FETCH CART ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});
router.delete("/removecart", fetchuser, async (req, res) => {
  try {

    const userId = req.user_id;
    const { productId, color, size } = req.body;

    if (!productId || !color || !size) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    await pool.execute(
      "CALL remove_from_cart(?,?,?,?)",
      [
        userId,
        productId,
        color,
        size
      ]
    );

    res.json({ success: true });

  } catch (err) {
    console.error("REMOVE CART ERROR:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


module.exports = router;
