const prisma = require('../prisma/client');
const { getCorrectlySolvedQuizQuestion } = require('./quizQuestionController');
const { getSubjectTopics } = require('./topicController');

const getQuestions = async (req, res) => {
    try {
        const questions = await prisma.question.findMany({
            include: {
                subject: {
                    select: { name: true }
                },
                topic: {
                    select: { topic_name: true }
                },
                options: {
                    select: {
                        opt_id: true,
                        text: true,
                        is_correct: true
                    }
                }
            }
        });
        return res.json(questions);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};

const getNextQuestion = async(req,res)=>{
    try{
        // console.log("in this route/func")
        const questionNumber = parseInt(req.body.questionNumber);
        const subjectID = parseInt(req.body.subjectID);
        const studentID = parseInt(req.body.studentID);
        const quizID = parseInt(req.body.quizID);

        // console.log(questionNumber,subjectID,studentID,quizID)
        //this selects only those questions that are correctly solved by the student in descending order of level
        


        //calculate topic index then figure out topic id
        const topics = await getSubjectTopics(subjectID);
        const topicIndex = questionNumber%topics.length;
        
        const correctlyAnsweredQuestions = await getCorrectlySolvedQuizQuestion(studentID,quizID,topics[topicIndex].topic_id);
        console.log('correct:',correctlyAnsweredQuestions)
        let nextLevel;
        if(correctlyAnsweredQuestions.length > 0){
            nextLevel = Math.min(3,correctlyAnsweredQuestions[0].question.level + 1);
        }
        else{
            nextLevel = 1;
        }

        console.log('topics',topics)
        console.log('topic index',topicIndex)
        console.log('nx level',nextLevel)

        const questions = await prisma.question.findMany({
            where:{
                topic_id:topics[topicIndex].topic_id,
                level:nextLevel,
                quizQuestions:{
                    none:{}
                }
            },
            include: {
                subject: { select: { name: true } },
                topic: { select: { topic_name: true } },
                options: { select: { opt_id: true, text: true ,is_correct:true} }
            }
        })
        console.log('remaining',questions)
        return res.status(200).json(questions);
    }
    catch(err){
        return res.status(500).json({ msg: err.message });
    }
}
module.exports = {
    getQuestions,
    getNextQuestion
};
