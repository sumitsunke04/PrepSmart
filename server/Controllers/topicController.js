const db = require('../config_neon/db'); // your drizzle client
const { Topic, Subject } = require('../schema_neon/user.schema');
const { eq } = require('drizzle-orm');

const getTopics = async (req, res) => {
  try {
    const topics = await db.select().from(Topic);
    return res.status(200).json(topics);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getSubjectTopics = async (subjectID) => {
  try {
    const topics = await db
      .select()
      .from(Topic)
      .where(eq(Topic.sub_id, subjectID));
    return topics;
  } catch (err) {
    throw new Error(err.message);
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

const addTopic = async (req, res) => {
  try {
    const { sub_id, topic_name } = req.body;

    const subjectExists = await db
      .select()
      .from(Subject)
      .where(eq(Subject.sub_id, sub_id));

    if (subjectExists.length === 0) {
      return res.status(404).json({ msg: `Subject with ID ${sub_id} doesn't exist` });
    }

    const topicExists = await db
      .select()
      .from(Topic)
      .where(eq(Topic.topic_name, topic_name));

    if (topicExists.length > 0) {
      return res.status(401).json({ msg: 'Topic already exists' });
    }

    const newTopic = await db.insert(Topic).values({ sub_id, topic_name }).returning();

    return res.status(200).json(newTopic[0]);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = {
  getTopics,
  getSubjectTopics,
  handleGetSubjectTopics,
  addTopic,
};
