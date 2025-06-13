const express = require("express");
const router = express.Router(); // Corrected here

const { addQuizQuestion, getFeedback, getHighestAttemptedLevelPerTopic } = require("../Controllers/quizQuestionController");

router.post("/submitAnswer", addQuizQuestion);
router.post('/getFeedback',getFeedback)
router.post('/getHighestLevel',getHighestAttemptedLevelPerTopic)

module.exports = router;
