const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const { pool } = require("../db");
  const { getPagination } = require("../utils/pagination");

router.post(
  "/add",
  [
    body("name").notEmpty().withMessage("Type name is required"),
    body("category").isIn(["Men","Women","Child"]).withMessage("Invalid category"),
    body("image").optional().isURL().withMessage("Invalid image URL"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, category, image } = req.body;
    try {
      const [rows] = await pool.execute("CALL create_type(?,?,?)", [name, category, image]);
      res.status(201).json({ success: true, typeId: rows[0][0].type_id });
    } catch (err) {
      if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ error: "Type already exists" });
      console.error(err);
      res.status(500).json({ error: "Server Error" });
    }
  }
);

router.get("/category/:category", async (req, res) => {
  try {
    const { page, limit } = req.query;

    const { pageNumber, pageSize, offset } = getPagination(page, limit);

    const category = req.params.category.charAt(0).toUpperCase() + req.params.category.slice(1).toLowerCase();

    const [rows] = await pool.execute(
      "CALL fetch_types_by_category(?, ?, ?)",
      [category, pageSize, offset]
    );

    const total = rows[1][0].total;

    res.status(200).json({
      success: true,
      types: rows[0],
      pagination: {
        page: pageNumber,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize),
        totalItems: total
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



router.put("/edit/:id", async (req, res) => {
  try {
    const { image } = req.body;
    const typeId = req.params.id;
    await pool.execute("CALL update_type_image(?, ?)", [typeId, image]);
    res.json({ success: true, message: "Type updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


router.delete("/delete/:id", async (req, res) => {
  try {
    const typeId = req.params.id;
    await pool.execute("CALL delete_type(?)", [typeId]);
    res.json({ success: true, message: "Type deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
