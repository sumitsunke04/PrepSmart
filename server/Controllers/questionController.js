const db = require('../config_neon/db');
const {
  Question,
  Subject,
  Topic,
  Option,
  QuizQuestion,
  Quiz,
} = require("../schema_neon/user.schema");
const { eq, and, sql, asc, desc, notInArray } = require("drizzle-orm");
const { getCorrectlySolvedQuizQuestion } = require("./quizQuestionController");
const { getSubjectTopics } = require("./topicController");

const getQuestions = async (req, res) => {
  try {
    const questionsRaw = await db.select({
        que_id: Question.que_id,
        text: Question.text,
        level: Question.level,
        subject_id: Subject.sub_id,
        subject: Subject.name,
        topic: Topic.topic_name,
        opt_id: Option.opt_id,
        opt_text: Option.text,
        is_correct: Option.is_correct,
      })
      .from(Question)
      .leftJoin(Subject, eq(Question.sub_id, Subject.sub_id))
      .leftJoin(Topic, eq(Question.topic_id, Topic.topic_id))
      .leftJoin(Option, eq(Question.que_id, Option.que_id));

    const groupedQuestions = [];

    questionsRaw.forEach(row => {
      let existing = groupedQuestions.find(q => q.que_id === row.que_id);

      const option = {
        opt_id: row.opt_id,
        text: row.opt_text,
        is_correct: row.is_correct,
      };

      if (existing) {
        existing.options.push(option);
      } else {
        groupedQuestions.push({
          que_id: row.que_id,
          text: row.text,
          level: row.level,
          subject_id: row.subject_id,
          subject: row.subject,
          topic: row.topic,
          options: [option],
        });
      }
    });

    console.log('question : ', groupedQuestions);
    return res.status(200).json(groupedQuestions);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getNextQuestion = async (req, res) => {
  try {
    console.log('here')
    const questionNumber = parseInt(req.body.questionNumber);
    // const subjectID = parseInt(req.body.subjectID);
    const studentID = req.body.studentID;
    const quizID = parseInt(req.body.quizID);

    console.log(req.body)
    const quiz = await db.select({
      quiz_id:Quiz.quiz_id,
      sub_id:Quiz.sub_id,
      std_id:Quiz.std_id
    })
    .from(Quiz)
    .where(
      eq(Quiz.quiz_id, quizID)
    )

    const subjectID = quiz[0].sub_id
    // console.log('sub id',subjectID)
    // console.log('studentID',studentID)
    // console.log('quiz id',quizID)
    
    const topics = await getSubjectTopics(subjectID);
    const topicIndex = questionNumber % topics.length;
    const topicID = topics[topicIndex].topic_id;

    console.log('ques num : ', questionNumber);
    console.log('topic id : ', topicID);
    console.log('student id : ', studentID);
    console.log('quiz id : ', quizID);
    console.log('subject id : ', subjectID);

    const correctQues = await getCorrectlySolvedQuizQuestion(
      studentID,
      quizID,
      topicID
    );

    console.log('correctQues : ',correctQues)
    let nextLevel = 1;
    if (correctQues.length > 0) {
      nextLevel = Math.min(4, correctQues[0].level + 1);
    }

    const attempted = await db
    .select({ que_id: QuizQuestion.que_id })
    .from(QuizQuestion)
    .where(
        and(
        eq(QuizQuestion.std_id, studentID),
        eq(QuizQuestion.quiz_id, quizID)
        )
    );

    console.log('attempted', attempted)
    const attemptedIDs = attempted.map((q) => q.que_id);

    const rawQuestions = await db
      .select({
        que_id: Question.que_id,
        text: Question.text,
        level: Question.level,
        subject_id: Subject.sub_id,
        subject: Subject.name,
        topic: Topic.topic_name,
        opt_id: Option.opt_id,
        opt_text: Option.text,
        is_correct: Option.is_correct,
      })
      .from(Question)
      .leftJoin(Subject, eq(Question.sub_id, Subject.sub_id))
      .leftJoin(Topic, eq(Question.topic_id, Topic.topic_id))
      .leftJoin(Option, eq(Question.que_id, Option.que_id))
      .where(
        and(
          eq(Question.topic_id, topicID),
          eq(Question.level, nextLevel),
          attemptedIDs.length > 0
            ? notInArray(Question.que_id, attemptedIDs)
            : sql`TRUE`
        )
      );

    const groupedQuestions = [];

    rawQuestions.forEach(row => {
      let existing = groupedQuestions.find(q => q.que_id === row.que_id);

      const option = {
        opt_id: row.opt_id,
        text: row.opt_text,
        is_correct: row.is_correct,
      };

      if (existing) {
        existing.options.push(option);
      } else {
        groupedQuestions.push({
          que_id: row.que_id,
          text: row.text,
          level: row.level,
          subject_id: row.subject_id,
          subject: row.subject,
          topic: row.topic,
          options: [option],
        });
      }
    });

    return res.status(200).json(groupedQuestions);
  } catch (err) {
    console.log('in error')
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getQuestions,
  getNextQuestion,
};
