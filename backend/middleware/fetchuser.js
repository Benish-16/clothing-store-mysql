const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "mySuperSecretKey";

const fetchuser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    console.log("Decoded user:", data); // should show { user_id: 1 }

    req.user_id = data.user_id;  // ✅ assign user_id from token
    next();
  } catch (error) {
    return res.status(401).json({ error: "Please authenticate using a valid token" });
  }
};

module.exports = fetchuser;
