const prisma = require('../prisma/client')

const getTopics = async(req,res)=>{
    try{
        const topics = await prisma.topic.findMany({})
        return res.status(200).json(topics);
    }
    catch(err){
        return res.status(500).json({msg:err.msg});
    }
}

const getSubjectTopics = async (subjectID) => {
    try {
        const topics = await prisma.topic.findMany({
            where: {
                sub_id: subjectID
            }
        });
        // console.log('topics inside',topics)
        return topics;
    } catch (err) {
        throw new Error(err.message);  // Throwing error to be handled in the route
    }
};

const handleGetSubjectTopics = async (req, res) => {
    try {
        const subjectID = parseInt(req.params.subjectID);

        const topics = await getSubjectTopics(subjectID);

        return res.status(200).json(topics);
    } catch (err) {
        return res.status(500).json({ msg: err.message });
    }
};



module.exports = {
    getTopics,
    handleGetSubjectTopics,
    getSubjectTopics
};