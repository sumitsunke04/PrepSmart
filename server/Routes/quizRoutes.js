const express = require("express");
const router = express.Router(); // Use `.Router()` instead of `.express()` for route modules

const { getSubjectQuizes } = require("../Controllers/quizController");

router.get("/quiz/:subId", getSubjectQuizes);

module.exports = router;
