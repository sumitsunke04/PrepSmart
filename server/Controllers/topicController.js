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
        console.log('sub id ',subjectID)
        const topics = await prisma.topic.findMany({
            where: {
                sub_id: subjectID
            }
        });
        console.log('topics inside',topics)
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

const addTopic = async(req,res)=>{
    try{
        const {sub_id,topic_name} = req.body;

        const sub = await prisma.subject.findFirst({
            where:{
                sub_id
            }
        })

        const topicExist = await prisma.topic.findFirst({
            where:{
                topic_name
            }
        })
        if(topicExist) return res.status(401).json({msg:"topic already exist"})
        if(!sub) return res.status(404).json({msg:`subject with id ${sub_id} doesnt exist`})
        const newTopic = await prisma.topic.create({
            data:{
                sub_id,
                topic_name
            }
        })
        return res.status(200).json(newTopic)
    }
    catch(err){
        return res.status(501).json({msg:err.msg})
    }
}

module.exports = {
    getTopics,
    handleGetSubjectTopics,
    getSubjectTopics,
    addTopic
};