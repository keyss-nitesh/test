const express = require("express");
const { register, login , checkAuth } = require("../controllers/authcontroller");
const { requireAuth } = require('../middleware/authMiddleware');
const router = express.Router();

router.post("/register", register);
router.post("/login", login);

// Protected route
// router.get("/statusEnter", requireAuth, checkAuth);
router.get("/statusEnter", checkAuth);

module.exports = router;
