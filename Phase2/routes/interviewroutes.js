const express = require("express");
const router = express.Router();

const {
  startInterview,
} = require("../controllers/interviewController");

router.post("/start", startInterview);

module.exports = router;