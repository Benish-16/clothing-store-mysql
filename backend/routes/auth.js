const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Otp = require('../models/otpmodel');
const sendEmail = require('../Emailsend');

const JWT_SECRET = "mySuperSecretKey";
router.post(
    '/createuser',[
        body('email', 'Enter a valid email').isEmail(),
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('password', 'Enter a valid password').exists(),
 body('admin')
  .optional()
  .isBoolean()


    ],
      async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "User with this email already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
        admin: req.body.admin || false 
      });

      const payload = { user: { id: user.id } };
      const authToken = jwt.sign(payload, JWT_SECRET);

      res.json({ success: true, authToken });
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }
);

router.post(
  '/login',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Enter a valid password').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }

      const payload = { user: { id: user.id } };
      const authToken = jwt.sign(payload, JWT_SECRET);

      res.json({ success: true, authToken , user: {
    id: user._id,
    name: user.name,
    email: user.email,
    admin: user.admin 
  }});
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  }

  
);
//forgetpassword
router.post(
  '/forgotpassword',
  [
    body('email', 'Enter a valid email').isEmail(),
  
  ],async(req,res)=>{
  const {email}=req.body;
  try{
const user=await User.findOne({email});
  if (!user) {
        return res.status(400).json({ error: "Please try to login with correct credentials" });
      }
      const otp=Math.floor(Math.random()*999999);
      const newOpt= new Otp({
email,
otp
        });
        await newOpt.save();
        const message=`Your verification code for password reset id ${otp} `;
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

    const { email, otp } = req.body;

    try {
      const otpRecord = await Otp.findOne({ email, otp });

      if (
        !otpRecord ||
        Date.now() > otpRecord.createdAt.getTime() + 10 * 60 * 1000
      ) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);

router.post(
  '/reset-password',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('otp', 'OTP is required').isNumeric(),
    body('newPassword', 'Password must be at least 6 characters').isLength({ min: 6 })
  ],
  async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp, newPassword } = req.body;

    try {
      const otpRecord = await Otp.findOne({
        email,
        otp: Number(otp)
      });

      if (
        !otpRecord ||
        Date.now() > otpRecord.createdAt.getTime() + 10 * 60 * 1000
      ) {
        return res.status(400).json({ error: "Invalid or expired OTP" });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "User not found" });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      await user.save();

      await Otp.deleteMany({ email });

      res.status(200).json({ message: "Password reset successfully" });

    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  }
);


module.exports = router;