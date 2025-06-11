const express = require("express");
const router = express.Router(); // Use `.Router()` instead of `.express()` for route modules

const { getSubjectQuizes, addQuiz } = require("../Controllers/quizController");

router.get("/quiz/:subId", getSubjectQuizes);
router.post('/addQuiz',addQuiz)

module.exports = router;
