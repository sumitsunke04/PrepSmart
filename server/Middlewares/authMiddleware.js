//..............INCOMPLETE................

//..............INCOMPLETE................

//..............INCOMPLETE................





// const jwt = require('jsonwebtoken');
// require("dotenv").config();

// const authenticateStudent = (req,res,next)=>{
//     const token = req.header("Authorization");

//     if(!token){
//         return res.status(401).json({msg:"token unavailable"})
//     }

//     try{
//         const decoded = jwt.verify(token,process.env.JWT_KEY)

//         req.studentID = decoded.std_id;
//         next();
//     }
//     catch(err){
//         return res.status(400).json({msg:"Invalid token"})
//     }
// }

// module.exports = {authenticateStudent}