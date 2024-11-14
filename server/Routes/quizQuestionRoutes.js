const express = require('express')
const router = express();
const {addQuizQuestion} = require('../Controllers/quizQuestionController')

// router.get('/mcq-exam',getQuestions);
router.post('/submitAnswer',addQuizQuestion);

module.exports = router;