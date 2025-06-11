const express = require("express");
const router = express.Router(); // Corrected here

const { addQuizQuestion } = require("../Controllers/quizQuestionController");

router.post("/submitAnswer", addQuizQuestion);

module.exports = router;
