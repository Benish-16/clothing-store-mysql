const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");

const sendEmail = require('../Emailsend');
const { pool } = require('../db');

const { body, validationResult } = require("express-validator");
const { getPagination } = require("../utils/pagination");

router.post("/create", fetchuser, async (req, res) => {
  try {
    const { customer, cartItems, subtotal, shippingCost, deliveryType, total, paymentMethod } = req.body;

    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

    const { firstName, lastName, email, phone, address, apartment, city, state, pin, country } = customer;


    const [result] = await pool.execute(
      `CALL create_order(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [
        req.user_id,
        firstName,
        lastName,
        email,
        phone,
        address,
        apartment,
        city,
        state,
        pin,
        country || "India",
        subtotal,
        shippingCost,
        deliveryType,
        total,
        paymentMethod || "Card"
      ]
    );
console.log("CALL create_order params:", [
  req.user_id,
  firstName, lastName, email, phone, address, apartment, city, state, pin, country, subtotal, shippingCost, deliveryType, total, paymentMethod
]);

    
const orderId = result[0][0].order_id;



    for (let item of cartItems) {
        console.log( "hi",orderId,
       item.product_id,
          item.name,
          item.variant_color,
          item.variant_image,
          item.size,
          item.quantity,
          item.price);
      await pool.execute(
        `CALL add_order_item(?,?,?,?,?,?,?,?)`,
        [
          orderId,
       item.product_id,
          item.name,
          item.variant_color,
          item.variant_image,
          item.size,
          item.quantity,
          item.price
        ]
      );
    }

    
    await pool.execute(`DELETE FROM cart_items WHERE cart_id = (SELECT id FROM carts WHERE user_id = ?)`, [req.user_id]);

    res.status(201).json({ success: true, message: "Order placed successfully", orderId });
  } catch (err) {
    console.error("CREATE ORDER ERROR:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

router.post(
  '/sendotp',
  [
    body('email', 'Enter a valid email').isEmail(),
  
  ],async(req,res)=>{
  const {email}=req.body;
      console.log("SEND OTP HIT");
  console.log("BODY:", req.body);
  try{

      const otp=Math.floor(Math.random()*999999);
     console.log("OTP GENERATED:", otp);
  
     await pool.execute('CALL store_otp_order(?, ?)', [email, otp]);
   
        const message=`Your verification code for confirmation id ${otp} `;
        await sendEmail(email,"Confirmation",message);
     console.log("EMAIL SENT");
        res.status(200).json({message:"otp send to your email"});
}
 catch(error){
  console.error("Forgot Password Error:", error);
  res.status(500).json({ success: false, message: "Internal server error" });
}

});

router.post(
  '/verify-otp',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('otp', 'OTP is required').isNumeric()
  ],
 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
     const email = req.body.email;
    const otp = Number(req.body.otp); 
  console.log("Verify OTP request:", { email, otp });
    try {
   await pool.execute("CALL verify_otp_order(?, ?)", [email, otp]);

      res.status(200).json({ success: true, message: "OTP verified successfully" });

    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);
router.post("/sendemail", async (req, res) => {
  const { email, cartItems, total ,shippingCost,subtotal} = req.body;

  if (!email) return res.status(400).json({ message: "Email missing" });

  try {
   
   let htmlContent = `
  <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px; color:#333; background:#f9f9f9;">
    <h2 style="text-align:center; color:#4CAF50;">Thank you for your order!</h2>
    <p style="text-align:center;">We’re excited to let you know your order has been placed successfully.</p>

    <h3 style="border-bottom:1px solid #ddd; padding-bottom:5px;">Order Details</h3>

    <table width="100%" style="border-collapse:collapse;">
      <thead>
        <tr>
          <th align="left">Item</th>
          <th align="center">Color</th>
          <th align="center">Size</th>
          <th align="center">Qty</th>
          <th align="right">Price</th>
        </tr>
      </thead>
      <tbody>
`;

cartItems.forEach(item => {
  htmlContent += `
    <tr>
      <td style="padding:8px;">
        <img src="${item.variant_image}" width="50" style="vertical-align:middle; margin-right:10px;" />
        ${item.name}
      </td>
      <td align="center">${item.variant_color}</td>
      <td align="center">${item.size}</td>
      <td align="center">${item.quantity}</td>
      <td align="right">₹${item.price * item.quantity}</td>
    </tr>
  `;
});

htmlContent += `
      </tbody>
    </table>

    <hr style="margin:20px 0;" />

    <table width="100%" style="font-size:14px;">
      <tr>
        <td>Subtotal</td>
        <td align="right">₹${subtotal}</td>
      </tr>
      <tr>
        <td>Shipping Charges</td>
        <td align="right">₹${shippingCost}</td>
      </tr>
      <tr style="font-weight:bold;">
        <td>Total</td>
        <td align="right">₹${total}</td>
      </tr>
    </table>

    <p style="text-align:center; margin-top:30px;">
      If you have any questions, feel free to contact our support team.
    </p>

    <div style="text-align:center; font-size:12px; color:#777; margin-top:40px;">
      &copy; ${new Date().getFullYear()} Your Store Name. All rights reserved.
    </div>
  </div>
`;

    await sendEmail(email, "Your Order Confirmation",  
  "Thank you for your order. Your order details are below.", htmlContent);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});


router.get("/all", async (req, res) => {

  try {

    const { page, limit } = req.query;

    const { pageNumber, pageSize, offset } =
      getPagination(page, limit);

    const [result] = await pool.query(
      "CALL get_all_orders(?,?)",
      [pageSize, offset]
    );

    const orders = result[0];
  const total = result[1][0].total;  

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        page: pageNumber,
        limit: pageSize,
      
         totalPages: Math.ceil(total / pageSize),
        totalItems: total
      }
    });

  } catch (error) {
    console.error("FETCH ALL ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
});
router.patch("/updatestatus/:id", async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const orderId = req.params.id;


    const [result] = await pool.query("CALL update_order_status(?, ?)", [
      orderId,
      orderStatus,
    ]);

   
    res.json({ success: true, message: "Order status updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
