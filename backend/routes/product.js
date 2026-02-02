const express = require("express");
const router = express.Router();
const sendEmail = require('../Emailsend');
const { pool } = require("../db");
   const { getPagination } = require("../utils/pagination");

const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");

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

   
      const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors.array()); 
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, description, price, category, type, variants } = req.body;

    let connection;

    try {

      connection = await pool.getConnection();
      await connection.beginTransaction();

  
      const [typeRows] = await connection.execute(
        "SELECT id FROM types WHERE name = ? AND category = ?",
        [type, category]
      );

      if (typeRows.length === 0) {
        await connection.rollback();
        return res.status(400).json({ error: "Type not found" });
      }

      const typeId = typeRows[0].id;

    
      const [productResult] = await connection.execute(
        "CALL create_product(?,?,?,?,?)",
        [name, description, price, category, typeId]
      );

      const productId = productResult[0][0].product_id;

   
      for (const variant of variants) {

        const [variantResult] = await connection.execute(
          "CALL add_variant(?,?,?)",
          [productId, variant.color, variant.images]
        );

        const variantId = variantResult[0][0].variant_id;

        for (const size of variant.sizes) {
          await connection.execute(
            "CALL add_size(?,?,?)",
            [variantId, size.size, size.quantity]
          );
        }
      }
const imageUrl = variants[0]?.images;


  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      <h2 style="color:#222;">New Product Launched </h2>
      ${
        imageUrl
          ? `<img src="${imageUrl}" alt="${name}" style="width:100%; max-height:350px; object-fit:cover; border-radius:8px;" />`
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


    const [rows] = await connection.execute("CALL GetAllSubscribers()");


    rows[0].forEach(sub => {
      sendEmail(
        sub.email,
        "New Product Alert",
        "A new product has been added to our store",
        htmlContent
      );
    });

    console.log("Emails sent successfully!");
      await connection.commit();

      res.status(201).json({
        success: true,
        productId
      });

    } catch (err) {

      if (connection) await connection.rollback();
      console.error(err);
      res.status(500).json({ error: "Server Error" });

    } finally {
      if (connection) connection.release();
    }
  }
);
router.get("/fetchproduct", async (req, res) => {
  try {
    const { category, type, page, limit } = req.query;

    const { pageNumber, pageSize, offset } = getPagination(page, limit);

    const [result] = await pool.execute(
      "CALL get_filtered_products(?, ?, ?, ?)",
      [
        category || null,
        type || null,
        pageSize,
        offset
      ]
    );

    const data  = result[0];   
    const total = result[1][0].total; 

   if (!data || data.length === 0) {
  return res.status(200).json({
    success: true,
    products: [],
    pagination: {
      page: pageNumber,
      limit: pageSize,
      totalItems: total,
      totalPages: Math.ceil(total / pageSize)
    }
  });
}

    const productsMap = new Map();

    for (const row of data) {

      if (!productsMap.has(row.product_id)) {
        productsMap.set(row.product_id, {
          id: row.product_id,
          name: row.name,
          description: row.description,
          price: row.price,
          category: row.category,
          type: row.type_name,
          variants: []
        });
      }

      const product = productsMap.get(row.product_id);

      if (row.variant_id) {

        let variant = product.variants.find(
          v => v.id === row.variant_id
        );

        if (!variant) {
          variant = {
            id: row.variant_id,
            color: row.color,
            images: row.images ? row.images.split(",") : [],
            sizes: []
          };
          product.variants.push(variant);
        }

        if (row.size_id) {
          variant.sizes.push({
            id: row.size_id,
            size: row.size,
            quantity: row.quantity
          });
        }
      }
    }

    res.status(200).json({
      success: true,
      products: [...productsMap.values()],
      pagination: {
        page: pageNumber,
        limit: pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize)
      }
    });

  } catch (err) {
    console.error("FetchProduct Error:", err);
    res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const productId = req.params.id;


    const [rows] = await pool.execute("CALL get_product_by_id(?)", [productId]);
const data = rows[0]; 
    if (data.length === 0) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const productsMap = new Map();

    for (const row of data) {
      if (!productsMap.has(row.product_id)) {
        productsMap.set(row.product_id, {
          id: row.product_id,
          name: row.name,
          description: row.description,
          price: row.price,
          category: row.category,
          type: row.type_name,
          variants: []
        });
      }

      const product = productsMap.get(row.product_id);

      if (row.variant_id) {
        let variant = product.variants.find(v => v.id === row.variant_id);
        if (!variant) {
          variant = {
            id: row.variant_id,
            color: row.color,
            images: row.images ? row.images.split(",") : [],
            sizes: []
          };
          product.variants.push(variant);
        }

        if (row.size_id) {
          variant.sizes.push({
            id: row.size_id,
            size: row.size,
            quantity: row.quantity
          });
        }
      }
    }

   res.status(200).json({ success: true, product: [...productsMap.values()][0] });




  } catch (err) {
    console.error("Get Product Error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});
router.put("/update/:id", fetchuser, async (req, res) => {

  const connection = await pool.getConnection();

  try {

    const productId = req.params.id;
    const { name, description, price, variants } = req.body;

     const [users] = await  connection.execute(
      "SELECT is_admin FROM users WHERE user_id = ?",
          [req.user_id] 
    );

   
    if (!users.length || users[0].is_admin !== 1) {
      return res.status(403).json({ error: "Admin access only" });
    }


    await connection.beginTransaction();

  
    await connection.execute(
      "CALL update_product_basic(?,?,?,?)",
      [productId, name, description, price]
    );


    if (variants && variants.length) {

  for (const v of variants) {

    const [variantResult] = await connection.execute(
      "CALL add_variant(?,?,?)",
      [
        productId,
        v.color,
        Array.isArray(v.images) ? v.images.join(",") : v.images
      ]
    );

    const variantId = variantResult[0][0].variant_id;

    if (v.sizes && v.sizes.length) {
      for (const size of v.sizes) {
        await connection.execute(
          "CALL add_size(?,?,?)",
          [variantId, size.size, size.quantity]
        );
      }
    }
  }
}

    await connection.commit();

    res.json({ success: true });

  } catch (err) {

    await connection.rollback();
    console.error("Update product error:", err);
    res.status(500).json({ success: false, message: "Server error" });

  } finally {
    connection.release();
  }
});


module.exports = router;
