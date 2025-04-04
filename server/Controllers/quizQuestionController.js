const prisma = require('../prisma/client');

const getCorrectlySolvedQuizQuestion = async(studentID,quizID,topicID)=>{
    try{
        // const studentID = parseInt(req.body.studentID);
        // const quizID = parseInt(req.body.quizID);

        console.log('ids',studentID,quizID)
        //this selects only those questions that are correctly solved by the student in descending order of level
        const questions = await prisma.quizQuestion.findMany({
            where:{
                std_id:studentID,
                quiz_id:quizID,
                question:{
                    topic_id:topicID,
                },
                option: {
                    is_correct: true  // Filters for only the correctly selected options
                }
            },
            include:{
                question:{
                    select:{
                        que_id:true,
                        text:true,
                        level:true
                    }
                }
            },
            orderBy:{
                question:{
                    level:'desc'
                }
            }
        })
        return questions;
    }
    catch(err){
        return  err.message ;
    }
}

const addQuizQuestion = async(req,res)=>{
    try {
        console.log('inside addition')
        const { quiz_id, que_id, std_id, selected_opt_id } = req.body;
        
        console.log('body',req.body)
        // Validate input data
        if (!quiz_id || !que_id || !std_id || !selected_opt_id) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
    
        // std_id = parseInt(std_id)
        console.log('reached here')
        // Create a new QuizQuestion record in the database using Prisma
        const newQuizQuestion = await prisma.quizQuestion.create({
          data: {
            quiz_id,
            que_id,
            std_id,
            selected_opt_id
          }
        });
    
        console.log('quiz ques added')
        // Respond with the created QuizQuestion
        return res.status(201).json({
          message: 'QuizQuestion added successfully',
          quizQuestion: newQuizQuestion
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'An error occurred while adding the quiz question' });
      }
}
module.exports = {
    getCorrectlySolvedQuizQuestion,
    addQuizQuestion
}