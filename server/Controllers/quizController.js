const prisma = require('../prisma/client')
const PrismaClient = require('@prisma/client')

const getSubjectQuizes = async(req,res)=>{
    try{
        const subId = parseInt(req.params.subId);
        
        const quiz = await prisma.quiz.findFirst({
            where:{
                sub_id:subId
            }
        })
        return res.status(201).json(quiz)
    }
    catch(err){
        return res.status(500).json({ msg: err.message });
    }
}

module.exports = {getSubjectQuizes}