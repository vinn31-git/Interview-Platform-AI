const express = require("express");

const {
  runCode,
} = require("../controllers/judge0Controller");

const router = express.Router();

router.post("/run", runCode);

module.exports = router;