const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { signup, login, verifyToken, updateProfile } = require("../controllers/authController");

router.post("/signup", signup);
router.post("/login", login);
router.get("/verify", authMiddleware, verifyToken);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
