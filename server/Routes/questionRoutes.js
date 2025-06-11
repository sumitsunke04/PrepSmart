const express = require("express");
const router = express.Router(); // Fixed from express() to express.Router()

const {
  getQuestions,
  getNextQuestion,
} = require("../Controllers/questionController");
const { authenticateStudent } = require("../Middlewares/authMiddleware");

router.post("/question", authenticateStudent, getNextQuestion);

module.exports = router;
