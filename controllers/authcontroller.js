const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../config/db');

// Create JWT
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
}

// REGISTER USER
exports.register = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  try {
    // Check user exists
    const [rows] = await db.promise().query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    if (rows.length > 0)
      return res.status(409).json({ error: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Insert into DB
    await db.promise().query(
      "INSERT INTO users (username, password) VALUES (?, ?)",
      [username, hashed]
    );

    res.status(201).json({ message: "User registered successfully" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  const { username, password } = req.body; // user enter throug FE or post man 

  if (!username || !password)
    return res.status(400).json({ error: "username and password required" });

  try {
    const [rows] = await db.promise().query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );
    console.log("line 59. rows length =", rows.length);

    if (rows.length === 0)
      return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    console.log("line 54" + JSON.stringify(user))

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ error: "Invalid credentials" });

    // Generate token
    const token = generateToken({
      id: user.id,
      username: user.username,
    });

    console.log("line 77" + JSON.stringify(token))

    res.json({
      message: "Login successful",
      token,
      expiresIn: process.env.JWT_EXPIRES_IN
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};


exports.checkAuth = (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token)
      return res.status(401).json({ error: "Token required" });

    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("Decoded Token:", decoded);

    res.json({
      message: "You are an authenticated user",
      user: decoded
    });
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};



