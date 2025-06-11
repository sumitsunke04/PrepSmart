const express = require('express');
const router = express();

const {
  addTopic,
  getTopics,
  handleGetSubjectTopics,
} = require('../Controllers/topicController');

router.get('/topic/:subjectID', handleGetSubjectTopics);
router.get('/topic', getTopics);
router.post('/addTopic', addTopic);

module.exports = router;
