const express = require("express");
const router = express.Router();
const Product = require("../models/Product");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const User = require('../models/User');
const Type = require("../models/Type");
const Subscription = require("../models/Subscription");
const sendEmail = require('../Emailsend');
router.post(
  "/addproduct",
  [
    body("name").isLength({ min: 3 }).withMessage("Product name must be at least 3 characters"),
    body("description").isLength({ min: 10 }).withMessage("Description must be at least 10 characters"),
    body("price").isFloat({ gt: 0 }).withMessage("Price must be greater than 0"),
    body("category").isIn(["Men", "women", "Child"]).withMessage("Invalid category"),
    body("type").notEmpty().withMessage("Type name is required"),

    body("variants").isArray({ min: 1 }).withMessage("At least one color variant is required"),
    body("variants.*.color").notEmpty().withMessage("Color is required"),
    body("variants.*.images").notEmpty().withMessage("Each color must have images"),
    body("variants.*.sizes").isArray({ min: 1 }).withMessage("Each color must have sizes"),
    body("variants.*.sizes.*.size").notEmpty().withMessage("Size is required"),
    body("variants.*.sizes.*.quantity")
      .isInt({ min: 0 })
      .withMessage("Quantity must be 0 or more"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { name, description, price, category, type, variants } = req.body;

      const typeDoc = await Type.findOne({
        name: { $regex: `^${type}$`, $options: "i" },
        category
      });

      if (!typeDoc) {
        return res.status(400).json({
          success: false,
          message: `Type "${type}" not found in category "${category}"`
        });
      }

      const product = new Product({
        name: name.trim(),
        description: description.trim(),
        price,
        category,
        type: typeDoc._id,   
        variants
      });

      const savedProduct = await product.save();
      const imageUrl = variants[0]?.images;

const htmlContent = `
<div style="font-family: Arial, sans-serif; max-width: 600px;">
  <h2 style="color:#222;">New Product Launched </h2>

  ${
    imageUrl
      ? `<img src="${imageUrl}" alt="${name}"
         style="width:100%; max-height:350px; object-fit:cover; border-radius:8px;" />`
      : ""
  }

  <h3>${name}</h3>
  <p>${description}</p>

  <p><strong>Price:</strong> ₹${price}</p>
  <p><strong>Category:</strong> ${category}</p>

  <a href="http://localhost:3000/product/${category}/${type}"
     style="display:inline-block; padding:10px 16px;
            background:#000; color:#fff; text-decoration:none;
            border-radius:6px;">
    View Product
  </a>

  <p style="margin-top:20px; font-size:12px; color:#777;">
    You are receiving this email because you subscribed to our store.
  </p>
</div>
`;

const subscribers = await Subscription.find({}, { email: 1 });

subscribers.forEach(sub => {
  sendEmail(
    sub.email,
    "New Product Alert ",
    "A new product has been added to our store",
    htmlContent
  );
});


      res.status(201).json({ success: true, product: savedProduct });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  }
);


router.get("/fetchproduct", async (req, res) => {
  try {
    const { category, type: typeName } = req.query;

   
    const filter = {};
    if (category) filter.category = { $regex: `^${category}$`, $options: "i" };


    let products = await Product.find(filter).populate("type");

   
    if (typeName) {
      products = products.filter(
        (p) => p.type && p.type.name.toLowerCase() === typeName.toLowerCase()
      );
    }

    res.status(200).json({ success: true, products });
  } catch (err) {
    console.error("FetchProduct Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
router.put("/update/:id", fetchuser, async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, variants } = req.body;
 const dbUser = await User.findById(req.user.id);

    if (!dbUser || !dbUser.admin) {
      return res.status(403).json({ error: "Admin access required" });
    }

    const product = await Product.findByIdAndUpdate(
      productId,
      { name, variants },
      { new: true }
    );

    res.json({ success: true, product });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.delete(
  "/delete",
  fetchuser,
  async (req, res) => {
    try {
      const user = await User.findById(req.user.id);

      if (!user || !user.admin) {
        return res.status(403).json({ error: "Admin access only" });
      }

      const { productId } = req.body;

      await Product.findByIdAndDelete(productId);

      res.json({ success: true });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  }
);


module.exports = router;
