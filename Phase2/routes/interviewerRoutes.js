const express = require("express");
const router = express.Router();

const {
  getInitialMessage,
  chatWithInterviewer,
  presentQuestion,
} = require("../controllers/interviewerController");

router.post("/interviewer/init", getInitialMessage);
router.post("/interviewer/chat", chatWithInterviewer);
router.post("/interviewer/present-question", presentQuestion);

module.exports = router;
