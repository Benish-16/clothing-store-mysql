const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { pool } = require('../db');
const { body, validationResult } = require('express-validator');
const sendEmail = require('../Emailsend');
const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey";

router.post('/createuser', async (req, res) => {
  const { name, email, password, admin } = req.body;


  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  try {
  
    await pool.execute('CALL create_user(?,?,?,?)', [
      name,
      email,
      password,      
      admin || 0
    ]);

     const [users] = await pool.execute('SELECT user_id, name, email, is_admin FROM users WHERE email = ?', [email]);
    const user = users[0];

    if (!user) {
      return res.status(500).json({ error: 'User creation failed' });
    }

   
    const payload = { user_id: user.user_id };
    const authToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' });
    res.status(201).json({ success: true, authToken });

  } catch (err) {
    console.error(err);


    if (err.sqlState === '45000') {
      return res.status(400).json({ error: err.message });
    }

  
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'User already exists' });
    }

    res.status(500).json({ error: 'Server Error' });
  }
});

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
         const [rows] = await pool.execute('CALL login_user(?, ?)', [email, password]);

   
      const user = rows[0][0]; 
          const payload = { user_id: user.user_id };


      const authToken = jwt.sign(payload, JWT_SECRET);

      res.json({ success: true, authToken , user: {
    id: user.user_id,
    name: user.name,
    email: user.email,
     admin: user.is_admin 
  }});
    } catch (err) {
    if (err.sqlState === '45000') {
        return res.status(400).json({ error: err.message });
      }
      res.status(500).send('Server Error');
    }
  }

  
);
router.post(
  '/forgotpassword',
  [
    body('email', 'Enter a valid email').isEmail(),
  
  ],async(req,res)=>{
  const {email}=req.body;
  try{
const [users]=await pool.execute('SELECT user_id FROM users WHERE email=?',[email]);
 if (users.length === 0) {
      return res.status(400).json({ error: "User not found" });
    }

  
      const otp=Math.floor(Math.random()*999999);
    
     
    await pool.execute('CALL store_otp(?, ?)', [email, otp]);

    await sendEmail(email, "Reset Password", `Your OTP is ${otp}`);

    res.json({ message: "OTP sent to your email" });
      
}
 catch(error){
  console.error("Forgot Password Error:", error);
  res.status(500).json({ success: false, message: "Internal server error" });
}

});

router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    await pool.execute('CALL verify_otp(?, ?)', [email, otp]);
    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    if (err.sqlState === '45000') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Server error" });
  }
});

router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    await pool.execute(
      'CALL reset_password(?, ?, ?)',
      [email, otp, newPassword]
    );

    res.json({ message: "Password reset successfully" });

  } catch (err) {
    if (err.sqlState === '45000') {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
