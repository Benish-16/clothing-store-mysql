const express = require("express");
const router = express.Router();
const { pool } = require("../db");

router.post("/sent", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, msg: "Email is required" });
    }

    const connection = await pool.getConnection();
    try {
 
      await connection.query("CALL AddSubscription(?)", [email]);

      res.status(201).json({
        success: true,
        msg: "Subscribed successfully",
        email,
      });
    } catch (err) {
    
      if (err.sqlState === "45000") {
        return res.status(400).json({ success: false, msg: err.sqlMessage });
      }
      throw err;
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
