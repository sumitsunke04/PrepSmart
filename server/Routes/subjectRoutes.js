const express = require('express')
const router = express();
const {addSubject, getAllSubjects,getSubject} = require('../Controllers/subjectController')

router.post('/addSubject',addSubject)
router.get('/getAllSubjects',getAllSubjects)
router.get('/getSubject/:id',getSubject)
module.exports = router;