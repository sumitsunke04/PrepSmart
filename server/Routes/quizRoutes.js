const express = require('express');
router = express();
const {getSubjectQuizes} = require('../Controllers/quizController')

router.get('/quiz/:subId',getSubjectQuizes)

module.exports = router