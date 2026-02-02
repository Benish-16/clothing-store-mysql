const express = require("express");
const router = express.Router();
const { pool } = require("../db");
const { body, validationResult } = require("express-validator");
const fetchuser = require("../middleware/fetchuser");
const sendEmail = require("../Emailsend");
   const { getPagination } = require("../utils/pagination");



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

      await pool.execute(
        "CALL add_contact(?,?,?,?)",
        [fullname, email, phone, message]
      );

      res.status(201).json({
        success: true,
        message: "Message sent successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ success: false, message: "Server error" });
    }
  }
);



router.get("/admin/messages", fetchuser, async (req, res) => {
  try {

    const { page, limit } = req.query;

    const { pageNumber, pageSize, offset } = getPagination(page, limit);

    const [users] = await pool.execute(
      "SELECT is_admin FROM users WHERE user_id = ?",
          [req.user_id] 
    );

   
    if (!users.length || users[0].is_admin !== 1) {
      return res.status(403).json({ error: "Admin access only" });
    }

       const [rows] = await pool.execute(
      "CALL get_all_contacts(?, ?)",
      [limit, offset]
    );
        const total = rows[1][0].total;
      const [replies] = await pool.execute("SELECT * FROM contact_replies");
      const contacts = rows[0]; 
        const messagesWithReplies = contacts.map(msg => {
      const msgReplies = replies.filter(r => r.contact_id === msg.id);
      return { ...msg, replies: msgReplies };
    });


    res.json({
      success: true,
       messages: messagesWithReplies,
        pagination: {
        page: pageNumber,
        limit: pageSize,
        totalItems: total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching admin messages:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post("/admin/messages/reply/:id", fetchuser, async (req, res) => {
  try {
    const { reply } = req.body;
    const contactId = req.params.id;

   const [users] = await pool.execute(
      "SELECT is_admin FROM users WHERE user_id = ?",
          [req.user_id] 
    );

   
   

    if (!users.length || users[0].is_admin !== 1) {
      return res.status(403).json({ error: "Admin access only" });
    }

 
    const [contacts] = await pool.execute(
      "SELECT fullname, email, message FROM contacts WHERE id = ?",
      [contactId]
    );

    if (!contacts.length) {
      return res.status(404).json({ error: "Contact not found" });
    }

    const contact = contacts[0];

    
    await pool.execute(
      "CALL reply_to_contact(?, ?)",
      [contactId, reply]
    );


    const htmlContent = `
      <h3>Hi ${contact.fullname},</h3>
      <p><strong>Your message:</strong></p>
      <blockquote>${contact.message}</blockquote>
      <p><strong>Admin reply:</strong></p>
      <blockquote>${reply}</blockquote>
      <p>Thank you!</p>
    `;

    await sendEmail(
      contact.email,
      "Reply to your message",
      "Admin reply",
      htmlContent
    );

    res.json({
      success: true,
      message: "Reply sent successfully",
    });
  } catch (error) {
    console.error("Error replying to contact:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
