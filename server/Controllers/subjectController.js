const {PrismaClient} = require('@prisma/client')
const prisma = require('../prisma/client')

const addSubject = async(req,res) => {
    try{
        const {name} = req.body;
        const existingSubject = await prisma.subject.findFirst({
            where:{
                name
            }
        })
        if(existingSubject){
            return res.status(400).json({msg : "Subject already exists"})
        }
        const newSubject = await prisma.subject.create({
            data:{
                name:name
            }
        })
        return res.status(201).json(newSubject)
    }catch(err){
        return res.status(500).json({msg:err.msg})
    }
}

const getAllSubjects = async(req,res)=>{
    try{
        const subjects = await prisma.subject.findMany({})
        return res.status(201).json(subjects)
    }catch(err){
        return res.status(500).json({msg:err.msg})
    }
}

const getSubject = async(req,res)=>{
    try{
        const subId= parseInt(req.params.id);

        const subject = await prisma.subject.findUnique({
            where:{
                sub_id:subId
            }
        })
        if(!subject) return res.status(404).json({msg:"subject doesnt exist"})
        return res.status(201).json(subject)
    }
    catch{
        return res.status(500).json({msg:err.msg})
    }
}
module.exports = {addSubject,getAllSubjects,getSubject}