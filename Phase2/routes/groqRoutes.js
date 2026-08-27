const express = require("express");
const router = express.Router();

const {
  generateQuestions,
} = require("../controllers/groqController");
const interviewerRoutes = require("./interviewerRoutes");

router.post("/generate-questions", generateQuestions);
router.use(interviewerRoutes);

module.exports = router;