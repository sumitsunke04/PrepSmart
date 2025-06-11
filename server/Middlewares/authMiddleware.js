//..............INCOMPLETE................

//..............INCOMPLETE................

//..............INCOMPLETE................




const jwt = require('jsonwebtoken');
require("dotenv").config();

const authenticateStudent = (req, res, next) => {
  const bearerToken = req.header("Authorization");
  console.log("Raw Auth Header:", bearerToken);

  if (!bearerToken || !bearerToken.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Token missing or improperly formatted" });
  }

  const token = bearerToken.split(" ")[1];
  // console.log("Token:", token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    // console.log("Decoded:", decoded);
    req.studentID = decoded.std_id;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(400).json({ msg: "Invalid token" });
  }
};

module.exports = { authenticateStudent };
