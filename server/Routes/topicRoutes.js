const express = require('express')
const router = express();

const {getTopics,handleGetSubjectTopics} = require('../Controllers/topicController')


router.get('/topic/:subjectID',handleGetSubjectTopics);
router.get('/topic',getTopics);

module.exports = router;