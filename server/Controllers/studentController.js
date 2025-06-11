const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config_neon/db');
const { Student } = require('../schema_neon/user.schema');
const { eq, and,or } = require('drizzle-orm');
require('dotenv').config();

const register = async (req, res) => {
  try {
    console.log('here')
    const {  fname, lname,username, email, password } = req.body;

    // Check if user already exists by username or email
    console.log('here1')
    const existingUser = await db
      .select()
      .from(Student)
      .where(
        or(
          eq(Student.username, username),
          eq(Student.email, email)
        )
      );

      console.log('here2')
    if (existingUser.length > 0) {
      return res.status(400).json({ msg: 'Username or email already exists' });
    }

    console.log('here3')
    const hashedPass = await bcrypt.hash(password, 10);

    const newStudent = await db.insert(Student).values({
      fname,
      lname,
      username,
      email,
      password: hashedPass,
    }).returning();

    console.log('new std',newStudent)
    return res.status(201).json(newStudent[0]);
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await db
      .select()
      .from(Student)
      .where(eq(Student.username, username));

    if (user.length === 0) {
      return res.status(500).json({ msg: 'Invalid username' });
    }

    const existingUser = user[0];
    const isMatch = await bcrypt.compare(password, existingUser.password);

    if (!isMatch) {
      return res.status(500).json({ msg: 'Invalid password' });
    }

    const token = jwt.sign(
      { std_id: existingUser.std_id, username: existingUser.username },
      process.env.JWT_KEY,
      { expiresIn: '1h' }
    );

    return res.status(201).json(token);
  } catch (err) {
    return res.status(400).json({ msg: err.message });
  }
};

module.exports = { register, login };
