const express = require("express");
const router = express.Router();
const Subscription = require("../models/Subscription");


router.post("/sent", async (req, res) => {
  try {
    const { email } = req.body;

   
    if (!email) {
      return res.status(400).json({ success: false, msg: "Email is required" });
    }


    const existing = await Subscription.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, msg: "Email already subscribed" });
    }


    const subscription = new Subscription({ email });
    await subscription.save();

    res.status(201).json({
      success: true,
      msg: "Subscribed successfully",
      email: subscription.email
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: "Server error" });
  }
});

module.exports = router;
