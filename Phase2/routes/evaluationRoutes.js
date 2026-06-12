const express = require("express");
const router = express.Router();

const {
  evaluateInterview,
} = require("../controllers/evaluationController");

router.post(
  "/evaluate",
  evaluateInterview
);

module.exports = router;