const express = require('express')
const router = express();
const {getQuestions, getNextQuestion} = require('../Controllers/questionController');
const { authenticateStudent } = require('../Middlewares/authMiddleware');


// router.get('/mcq-exam',getQuestions);
router.post('/question',authenticateStudent,getNextQuestion);

module.exports = router;