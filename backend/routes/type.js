// routes/type.js
const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Type = require("../models/Type");


router.post(
  "/add",
  [
    body("name").notEmpty().withMessage("Type name is required"),
    body("category").notEmpty().withMessage("Category is required"),
    body("image").optional().isURL().withMessage("Invalid image URL"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, category, image } = req.body;

      
      const existing = await Type.findOne({
        name: new RegExp(`^${name}$`, "i"),
        category,
      });

      if (existing) {
        return res.status(400).json({ msg: "Type already exists" });
      }

      const type = new Type({
        name,
        category,
       image
      });

      await type.save();

      res.status(201).json(type);
    } catch (err) {
      console.error(err); 
      res.status(500).json({ error: err.message });
    }
  }
);

router.get("/:category", async (req, res) => {
  try {
    let categoryParam = req.params.category;

  
    categoryParam =
      categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase();

    
    const types = await Type.find({ category: categoryParam });

    res.status(200).json(types);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/category/:category", async (req, res) => {
  try {
    let categoryParam = req.params.category;

    categoryParam =
      categoryParam.charAt(0).toUpperCase() + categoryParam.slice(1).toLowerCase();

  
    const types = await Type.find({ category: categoryParam });

    res.status(200).json(types);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/edit/:id", async (req, res) => {
  try {
    const { image } = req.body;

    const updatedType = await Type.findByIdAndUpdate(
      req.params.id,
      { image },
      { new: true }
    );

    if (!updatedType) {
      return res.status(404).json({ error: "Type not found" });
    }

    res.json(updatedType);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const type = await Type.findByIdAndDelete(req.params.id);

    if (!type) {
      return res.status(404).json({ error: "Type not found" });
    }

    res.json({ success: true, message: "Type deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
