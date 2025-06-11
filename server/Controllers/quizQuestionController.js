const db = require('../config_neon/db');
const { QuizQuestion, Option, Question } = require("../schema_neon/user.schema");
const { eq, and, desc } = require("drizzle-orm");

const getCorrectlySolvedQuizQuestion = async (studentID, quizID, topicID) => {
  try {

    console.log('studentID',studentID)
    console.log('quizID',quizID)
    console.log('topicID',topicID)

    const questions = await db
      .select({
        que_id: Question.que_id,
        text: Question.text,
        level: Question.level,
        topic_id:Question.topic_id
        
      })
      .from(QuizQuestion)
      .innerJoin(Question, eq(QuizQuestion.que_id, Question.que_id))
      .innerJoin(Option, eq(QuizQuestion.selected_opt_id, Option.opt_id))
      .where(
        and(
          eq(QuizQuestion.std_id, studentID),
          eq(QuizQuestion.quiz_id, quizID),
          eq(Question.topic_id, topicID),
          eq(Option.is_correct, true)
        )
      )
      .orderBy(desc(Question.level));

      console.log('correct solved ques of particular top : ',questions)
    return questions;
  } catch (err) {
    return err.message;
  }
};

const addQuizQuestion = async (req, res) => {
  try {
    const { quiz_id, que_id, std_id, selected_opt_id } = req.body;

    if (!quiz_id || !que_id || !std_id || !selected_opt_id) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db
      .insert(QuizQuestion)
      .values({ quiz_id, que_id, std_id, selected_opt_id })
      .returning();

      console.log('after iinsert',result)
    return res.status(201).json({
      message: "QuizQuestion added successfully",
      quizQuestion: result[0],
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "An error occurred while adding the quiz question" });
  }
};

module.exports = {
  getCorrectlySolvedQuizQuestion,
  addQuizQuestion,
};
