const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const {PrismaClient} = require('@prisma/client');
const prisma = require('../prisma/client');
require("dotenv").config();

const register = async(req,res)=>{
    try{
        const {username,fname,lname,email,password} = req.body;

        //check if user already exists
        const existingUser = await prisma.student.findUnique({
            where:{username,email},
        })

        if(existingUser){
            return res.status(400).json({msg:"username or email already exists"})
        }

        const hashedPass = await bcrypt.hash(password,10);

        const newStudent = await prisma.student.create({
            data:{
                fname,
                lname,
                username,
                email,
                password:hashedPass
            },
        })
        return res.status(201).json(newStudent)
    }catch(err){
        return res.status(500).json({msg:err.msg})
    }
}

const login = async(req,res)=>{
    try{
        const {username,password} = req.body;

        const existingUser = await prisma.student.findUnique({
            where:{
                username,
            },
        })

        if(!existingUser){
            return res.status(500).json({msg:"Invalid username"});
        }

        const isMatch = bcrypt.compare(password,existingUser.password);

        if(!isMatch){
            return res.status(500).json({msg:"Invalid password"});
        }

        const token = jwt.sign({std_id:existingUser.std_id,username:existingUser.username},process.env.JWT_KEY,{
            expiresIn: "1h",
        })

        return res.status(201).json(token);
    }catch(err){
        return res.status(400).json({msg:err.msg});
    }
}

module.exports = {register,login};