const { eq } = require("drizzle-orm");
const db = require('../config_neon/db'); 
const { Quiz } = require("../schema_neon/user.schema");

const getSubjectQuizes = async (req, res) => {
  try {
    const subId = parseInt(req.params.subId);

    const quiz = await db.select().from(Quiz).where(eq(Quiz.sub_id, subId));

    return res.status(200).json(quiz); // 200 is more appropriate for GET
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = { getSubjectQuizes };
