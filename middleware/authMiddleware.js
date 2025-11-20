const jwt = require('jsonwebtoken');

exports.requireAuth = (req, res, next) => {


  const auth = req.headers.authorization;



  if (!auth || !auth.startsWith("Bearer "))
    return res.status(401).json({ error: "No token provided" });

  const token = auth.split(" ")[1];

  try { 
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
