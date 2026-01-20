const express = require("express");
const router = express.Router();
const fetchuser = require("../middleware/fetchuser");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { body, validationResult } = require("express-validator");

const orderOtp = require('../models/orderotp');

const sendEmail = require('../Emailsend');


router.post("/create", fetchuser, async (req, res) => {
  try {
    const {  customer, cartItems, subtotal, shippingCost, deliveryType, total, paymentMethod } = req.body;
const email = customer?.email;

if (!email) {
  return res.status(400).json({ success: false, message: "Email missing" });
}

await orderOtp.deleteMany({ email });
    if (!cartItems || cartItems.length === 0)
      return res.status(400).json({ success: false, message: "Cart is empty" });

  
    const order = new Order({
      userId: req.user.id,   
      customer,
      cartItems,
      subtotal,
      shippingCost,
      deliveryType,
      total,
      paymentMethod,
      paymentStatus: "Done",
      orderStatus: "Pending"
    });
    console.log(order);

   
    await order.save();
await Cart.deleteOne({ user: req.user.id});
  

 
    await Cart.findOneAndUpdate({ user: req.user.id }, { items: [] });

    res.status(201).json({ success: true, message: "Order placed successfully", order });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});


router.post(
  '/sendotp',
  [
    body('email', 'Enter a valid email').isEmail(),
  
  ],async(req,res)=>{
  const {email}=req.body;
  try{

      const otp=Math.floor(Math.random()*999999);
      const newOpt= new orderOtp({
email,
otp
        });
        await newOpt.save();
        const message=`Your verification code for confirmation id ${otp} `;
        await sendEmail(email,"Reset Password",message);
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
 const otpRecord = await orderOtp.findOne({ email, otp });

      if (
        !otpRecord ||
        Date.now() > otpRecord.createdAt.getTime() + 10 * 60 * 1000
      ) {
        res.status(200).json({ success: true, message: "OTP verified successfully" });

      }

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
        <img src="${item.variant.image}" width="50" style="vertical-align:middle; margin-right:10px;" />
        ${item.name}
      </td>
      <td align="center">${item.variant.color}</td>
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
//fetch all
router.get("/all",  async (req, res) => {
  try {
    
     const orders = await Order.find();

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("FETCH ALL ORDERS ERROR:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

//updarestatus
router.patch("/updatestatus/:id", async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.orderStatus = orderStatus;
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
