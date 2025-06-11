const db = require('../config_neon/db');
const { QuizQuestion, Option, Question,Topic } = require("../schema_neon/user.schema");
const { eq, and, desc ,sql} = require("drizzle-orm");

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

const getTestDetails = async(std_id,quiz_id)=>{
  try {
    

    // Get all attempted quiz questions by std_id
    const attempted = await db
      .select({
        questionId: QuizQuestion.que_id,
        selectedOptionId: QuizQuestion.selected_opt_id,
        questionText: Question.text,
        selectedOptionText: Option.text,
      })
      .from(QuizQuestion)
      .innerJoin(Question, eq(QuizQuestion.que_id, Question.que_id))
      .leftJoin(Option, eq(QuizQuestion.selected_opt_id, Option.opt_id))
      .where(and(
        eq(QuizQuestion.std_id, std_id),
        eq(QuizQuestion.quiz_id, quiz_id)
      ));

    // For each question, fetch the correct option separately
    const feedbackWithCorrectOptions = await Promise.all(
      attempted.map(async (attempt) => {
        const correct = await db
          .select()
          .from(Option)
          .where(
            and(
              eq(Option.que_id, attempt.questionId),
              eq(Option.is_correct, true)
            )
          )
          .then(rows => rows[0]);

        //wrap the correct option in an object with other properties
        return {
          question: attempt.questionText,
          selectedOption: {
            id: attempt.selectedOptionId,
            text: attempt.selectedOptionText
          },
          correctOption: {
            id: correct.opt_id,
            text: correct.text
          },
          isCorrect: attempt.selectedOptionId === correct.opt_id
        };
      })
    );

    return feedbackWithCorrectOptions;
  } catch (err) {
    return { msg: err.message };
  }
}
const getFeedback = async (req, res) => {
  try{
    const { std_id, quiz_id } = req.body;
    const feedback = await getTestDetails(std_id, quiz_id);
    console.log(feedback)
    return res.status(200).json(feedback)
  }
  catch(err){
    return res.status(400).json({ msg: "Invalid request" });
  }

};


const getHighestAttemptedLevelPerTopic = async (req, res) => {
  try {
    const { std_id, quiz_id } = req.body;

    const results = await db
      .select({
        topic_id: Topic.topic_id,
        topic_name: Topic.topic_name,
        max_level: sql`MAX(${Question.level})`.as('max_level')
      })
      .from(QuizQuestion)
      .innerJoin(Question, eq(QuizQuestion.que_id, Question.que_id))
      .innerJoin(Topic, eq(Question.topic_id, Topic.topic_id))
      .where(
        and(
          eq(QuizQuestion.std_id, std_id),
          eq(QuizQuestion.quiz_id, quiz_id)
        )
      )
      .groupBy(Topic.topic_id, Topic.topic_name);

    return res.status(200).json(results);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getCorrectlySolvedQuizQuestion,
  addQuizQuestion,
  getFeedback,
  getHighestAttemptedLevelPerTopic
};
