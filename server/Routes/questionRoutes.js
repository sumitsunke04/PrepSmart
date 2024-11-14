const express = require('express')
const router = express();
const {getQuestions, getNextQuestion} = require('../Controllers/questionController');


// router.get('/mcq-exam',getQuestions);
router.post('/question',getNextQuestion);

module.exports = router;