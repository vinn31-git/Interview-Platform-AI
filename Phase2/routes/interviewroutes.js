const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const {
  startInterview,
  saveInterviewResults,
  getInterviewHistory,
  getInterviewById,
  getDashboardStats,
} = require("../controllers/interviewController");

router.post("/start", authMiddleware, startInterview);
router.get("/history", authMiddleware, getInterviewHistory);
router.get("/stats", authMiddleware, getDashboardStats);
router.get("/:id", authMiddleware, getInterviewById);
router.put("/:id/results", authMiddleware, saveInterviewResults);

module.exports = router;
