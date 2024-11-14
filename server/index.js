const express = require('express')

const app = express();
const cors = require('cors');
const questionRoutes = require('./Routes/questionRoutes')
const topicRoutes = require('./Routes/topicRoutes');
const quizQuestionRoutes = require('./Routes/quizQuestionRoutes')

app.use(cors());

app.use(express.json());





app.use('/',questionRoutes)
app.use('/',topicRoutes)
app.use('/', quizQuestionRoutes)

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})
