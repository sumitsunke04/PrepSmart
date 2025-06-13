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



const db = require('./config_neon/db');
const {
    Subject,
    Topic,
    Question,
    Option,
    Quiz,
    Student
  } = require('./schema_neon/user.schema');
  

//   app.post('/seed-dbms-database', async (req, res) => {
//     try {
//       // 1️⃣ Insert Subject
//       const [createdSubject] = await db.insert(Subject).values({
//         name: "DBMS"
//       }).returning();
//       const subId = createdSubject.sub_id;
  
//       // 2️⃣ Insert Topics
//       const topicNames = ["SQL", "Normalization", "ACID Properties"];
//       const createdTopics = await db.insert(Topic).values(
//         topicNames.map(name => ({ topic_name: name, sub_id: subId }))
//       ).returning();
  
//       const topicMap = {};
//       createdTopics.forEach(topic => {
//         topicMap[topic.topic_name] = topic.topic_id;
//       });
  
//       // 3️⃣ Prepare Unique Questions
//       const questionBank = {
//         "SQL": {
//           1: [
//             "What does SQL stand for?",
//             "Which SQL statement is used to retrieve data?",
//             "What is the purpose of the WHERE clause?"
//           ],
//           2: [
//             "What is the difference between WHERE and HAVING?",
//             "What is a JOIN in SQL?",
//             "Explain the use of GROUP BY."
//           ],
//           3: [
//             "What is a subquery in SQL?",
//             "How does a LEFT JOIN differ from an INNER JOIN?",
//             "Explain the concept of indexing in SQL."
//           ],
//           4: [
//             "What are window functions in SQL?",
//             "Explain the use of CTEs in SQL.",
//             "What is the difference between RANK() and DENSE_RANK()?"
//           ]
//         },
//         "Normalization": {
//           1: [
//             "What is database normalization?",
//             "Why is normalization important?",
//             "Define 1st Normal Form (1NF)."
//           ],
//           2: [
//             "What is 2nd Normal Form (2NF)?",
//             "Explain partial dependency.",
//             "What is the difference between 1NF and 2NF?"
//           ],
//           3: [
//             "Define 3rd Normal Form (3NF).",
//             "What is a transitive dependency?",
//             "How is 3NF achieved?"
//           ],
//           4: [
//             "What is BCNF (Boyce-Codd Normal Form)?",
//             "Difference between 3NF and BCNF?",
//             "Is BCNF always dependency-preserving?"
//           ]
//         },
//         "ACID Properties": {
//           1: [
//             "What does ACID stand for?",
//             "Why are ACID properties important?",
//             "What is Atomicity?"
//           ],
//           2: [
//             "Explain Consistency in transactions.",
//             "What is Isolation in ACID?",
//             "Give an example of a transaction violating isolation."
//           ],
//           3: [
//             "Define Durability in ACID.",
//             "How do databases ensure durability?",
//             "What happens if a system crashes during a transaction?"
//           ],
//           4: [
//             "What is a dirty read?",
//             "What is a phantom read?",
//             "Explain serializability in transaction management."
//           ]
//         }
//       };
  
//       // 4️⃣ Insert All Questions
//       const allQuestions = [];
//       for (const topic of topicNames) {
//         for (let level = 1; level <= 4; level++) {
//           for (const qText of questionBank[topic][level]) {
//             allQuestions.push({
//               text: qText,
//               level,
//               sub_id: subId,
//               topic_id: topicMap[topic]
//             });
//           }
//         }
//       }
  
//       const createdQuestions = await db.insert(Question).values(allQuestions).returning();
  
//       // 5️⃣ Insert Options (4 per question)
//       const options = [];
//       createdQuestions.forEach(q => {
//         options.push(
//           { text: "Correct Answer", is_correct: true, que_id: q.que_id },
//           { text: "Wrong Answer 1", is_correct: false, que_id: q.que_id },
//           { text: "Wrong Answer 2", is_correct: false, que_id: q.que_id },
//           { text: "Wrong Answer 3", is_correct: false, que_id: q.que_id }
//         );
//       });
  
//       await db.insert(Option).values(options);
  
//       // 6️⃣ Insert Quiz
//       await db.insert(Quiz).values({
//         quiz_name: "DBMS Quiz",
//         sub_id: subId
//       });
  
//       // 7️⃣ Insert Student
//       await db.insert(Student).values({
//         fname: "test1",
//         lname: "test1",
//         username: "test1",
//         email: "test1@test.com",
//         password: "test"
//       });
  
//       return res.status(200).json({ message: "Database seeded successfully!" });
//     } catch (error) {
//       console.error(error);
//       return res.status(500).json({ error: "Error seeding database" });
//     }
//   });
  
// app.post('/seed-os-database', async (req, res) => {
//   try {
//     const subjectId = 3; // Operating Systems
//     const topicId = 6;   // Multithreading
//     const level = 5;

//     const questionsWithOptions = [
//       {
//         text: "What is thread starvation?",
//         options: [
//           "Thread denied CPU access",
//           "Thread runs continuously",
//           "Thread spawns other threads",
//           "Thread sleeps forever",
//         ]
//       },
//       {
//         text: "How does priority inversion occur?",
//         options: [
//           "Low thread blocks high",
//           "High thread ignores lock",
//           "Mutex creates new thread",
//           "Scheduler swaps priorities",
//         ]
//       },
//       {
//         text: "What is deadlock prevention?",
//         options: [
//           "Avoids circular wait condition",
//           "Ensures fair thread pool",
//           "Reduces memory overhead",
//           "Eliminates context switch",
//         ]
//       },
//       {
//         text: "What is fine-grained locking?",
//         options: [
//           "Locks small code parts",
//           "Locks all shared memory",
//           "Delays all thread calls",
//           "Yields after blocking",
//         ]
//       },
//       {
//         text: "What is lock-free programming?",
//         options: [
//           "Avoids using locks",
//           "Blocks all access",
//           "Waits for resources",
//           "Uses mutex always",
//         ]
//       },
//     ];

//     const insertedQuestions = [];

//     for (const q of questionsWithOptions) {
//       const [insertedQuestion] = await db.insert(Question).values({
//         text: q.text,
//         level,
//         sub_id: subjectId,
//         topic_id: topicId,
//       }).returning({ que_id: Question.que_id });

//       const que_id = insertedQuestion.que_id;

//       const optionsToInsert = q.options.map((optionText, index) => ({
//         text: optionText,
//         is_correct: index === 0,
//         que_id,
//       }));

//       await db.insert(Option).values(optionsToInsert);
//       insertedQuestions.push({ que_id, text: q.text });
//     }

//     return res.status(200).json({
//       message: "Seeded Multithreading Level 5 questions successfully.",
//       questions: insertedQuestions
//     });
//   } catch (err) {
//     console.error("❌ Seeding failed:", err);
//     return res.status(500).json({ error: "Seeding failed for Multithreading Level 5." });
//   }
// });












const PORT = process.env.PORT || 5000;

require('./config_neon/db');

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
