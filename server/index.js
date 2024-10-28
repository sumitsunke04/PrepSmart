const express = require('express')
const {PrismaClient} = require('@prisma/client')
const prisma = new PrismaClient();
const app = express();

app.use(express.json());


app.listen(PORT,()=>{
    console.log(`server is running on port ${process.env.PORT}`)
})
