const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const User = require('../models/User');
const sendEmail = require('../Emailsend');


router.post(
  "/add",
  [
    body("fullname").notEmpty().withMessage("Full name required"),
    body("email").isEmail().withMessage("Valid email required"),
    body("message").notEmpty().withMessage("Message required"),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }

      const { fullname, email, phone, message } = req.body;

      const contact = new Contact({
        fullname,
        email,
        phone,
        message,
      });

      await contact.save();

      res.status(201).json({ success: true, message: "Message sent successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);
router.get("/admin/messages", fetchuser, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.admin) {
      return res.status(403).json({ error: "Admin access only" });
    }

    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching admin messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/admin/messages", fetchuser, async (req, res) => {
  try {

    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    if (!user.admin) {
      return res.status(403).json({ error: "Admin access only" });
    }

   
    const messages = await Contact.find().sort({ createdAt: -1 });

  
    res.json({ success: true, messages });
  } catch (error) {
    console.error("Error fetching admin messages:", error);  
    res.status(500).json({ error: "Internal Server Error" });
  }
});
router.post("/admin/messages/reply/:id", fetchuser, async (req, res) => {
  const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }


    if (!user.admin) {
      return res.status(403).json({ error: "Admin access only" });
    }


  const { reply } = req.body;

  const contact = await Contact.findById(req.params.id);
  if (!contact) return res.status(404).json({ msg: "Contact not found" });

  contact.replies.push({
    message: reply,
    repliedBy: "Admin",
  });
  await contact.save();

  const htmlContent = `
    <h3>Hi ${contact.fullname},</h3>
    <p>This is a reply to your message:</p>
    <blockquote style="border-left: 4px solid #ccc; padding-left: 10px;">
      ${contact.message}
    </blockquote>
    <p><strong>Admin Reply:</strong></p>
    <blockquote style="border-left: 4px solid #000; padding-left: 10px; background: #f4f4f4;">
      ${reply}
    </blockquote>
    <p>Thank you!</p>
  `;

  await sendEmail(
    contact.email,
    "Reply to your message",
    "You have a new reply from admin",
    htmlContent
  );

  res.json({ success: true });
});

module.exports = router;
