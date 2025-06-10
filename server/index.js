const express = require('express')

const app = express();
const cors = require('cors');
const questionRoutes = require('./Routes/questionRoutes')
const topicRoutes = require('./Routes/topicRoutes');
const quizQuestionRoutes = require('./Routes/quizQuestionRoutes')
const studentRoutes = require('./Routes/studentRoutes')
const subjectRoutes = require('./Routes/subjectRoutes')
const quizRoutes = require('./Routes/quizRoutes')
app.use(cors());

app.use(express.json());

// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();



app.use('/',questionRoutes)
app.use('/',topicRoutes)
app.use('/', quizQuestionRoutes)
app.use('/',studentRoutes)
app.use('/',subjectRoutes)
app.use('/',quizRoutes)

// app.get('/api',(req,res)=>{
//     res.json({message: 'Welcome to the API'})
// })


// app.post('/seed-database', async (req, res) => {
//     console.log('stage 1')
//     try {
//         // 1️⃣ Insert Subject
//         console.log('stage 2')
//         const subject = await prisma.subject.create({
//             data: { name: "DBMS" }
//         });

//         // 2️⃣ Insert Topics
//         const topics = await prisma.topic.createMany({
//             data: [
//                 { topic_id: 1, topic_name: "SQL", sub_id: subject.sub_id },
//                 { topic_id: 2, topic_name: "Normalization", sub_id: subject.sub_id },
//                 { topic_id: 3, topic_name: "ACID Properties", sub_id: subject.sub_id }
//             ]
//         });

//         // 3️⃣ Insert Questions (2 per level)
//         const questions = [
//             { que_id: 1, text: "What is SQL?", level: 1, sub_id: subject.sub_id, topic_id: 1 },
//             { que_id: 2, text: "Define Normalization.", level: 1, sub_id: subject.sub_id, topic_id: 2 },
//             { que_id: 3, text: "Explain ACID Properties.", level: 2, sub_id: subject.sub_id, topic_id: 3 },
//             { que_id: 4, text: "What is a primary key?", level: 2, sub_id: subject.sub_id, topic_id: 1 },
//             { que_id: 5, text: "What is 3rd Normal Form?", level: 3, sub_id: subject.sub_id, topic_id: 2 },
//             { que_id: 6, text: "Describe Isolation in ACID.", level: 3, sub_id: subject.sub_id, topic_id: 3 }
//         ];
//         await prisma.question.createMany({ data: questions });

//         // 4️⃣ Insert Options (4 per question)
//         const options = [];
//         questions.forEach(q => {
//             options.push(
//                 { text: "Correct Answer", is_correct: true, que_id: q.que_id },
//                 { text: "Wrong Answer 1", is_correct: false, que_id: q.que_id },
//                 { text: "Wrong Answer 2", is_correct: false, que_id: q.que_id },
//                 { text: "Wrong Answer 3", is_correct: false, que_id: q.que_id }
//             );
//         });
//         await prisma.option.createMany({ data: options });

//         // 5️⃣ Insert Quiz
//         const quiz = await prisma.quiz.create({
//             data: { quiz_name: "DBMS Quiz", sub_id: subject.sub_id }
//         });

//         // 6️⃣ Insert Student
//         const student = await prisma.student.create({
//             data: { fname: "John", lname: "Doe", username: "johndoe123" }
//         });

//         return res.status(200).json({ message: "Database seeded successfully!" });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: "Error seeding database" });
//     }
// });


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
