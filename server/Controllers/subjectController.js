const db = require('../config_neon/db'); // Drizzle DB instance
const { Subject } = require('../schema_neon/user.schema');
const { eq } = require('drizzle-orm');

const addSubject = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if subject already exists
    const existingSubject = await db
      .select()
      .from(Subject)
      .where(eq(Subject.name, name));

    if (existingSubject.length > 0) {
      return res.status(400).json({ msg: "Subject already exists" });
    }

    // Insert new subject
    const inserted = await db.insert(Subject).values({ name }).returning();
    return res.status(201).json(inserted[0]);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getAllSubjects = async (req, res) => {
  try {
    const subjects = await db.select().from(Subject);
    return res.status(200).json(subjects);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const getSubject = async (req, res) => {
  try {
    const subId = parseInt(req.params.id);

    const subject = await db
      .select()
      .from(Subject)
      .where(eq(Subject.sub_id, subId));

    if (!subject.length) {
      return res.status(404).json({ msg: "Subject doesn't exist" });
    }

    return res.status(200).json(subject[0]);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = { addSubject, getAllSubjects, getSubject };
