const {
  integer,
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
} = require("drizzle-orm/pg-core");

// ✅ MockInterview Table
const MockInterview = pgTable("mockInterview", {
  id: serial("id").primaryKey(),
  noOfQuestions: integer("noOfQuestion").notNull(),
  jsonMockResp: text("jsonMockResp").notNull(),
  jobPosition: varchar("jobPosition").notNull(),
  jobDesc: varchar("jobDesc").notNull(),
  jobExperience: varchar("jobExperience").notNull(),
  createdBy: varchar("createdBy").notNull(),
  createdAt: varchar("createdAt"),
  mockId: varchar("mockId").notNull(),
});

// ✅ UserAnswer Table
const UserAnswer = pgTable("userAnswer", {
  id: serial("id").primaryKey(),
  mockIdRef: varchar("mockId").notNull(),
  question: varchar("question").notNull(),
  correctAnswer: text("correctAnswer"),
  userAnswer: text("userAnswer"),
  feedback: text("feedback"),
  rating: varchar("rating"),
  emotionFeedback: text("emotionFeedback"),
  userEmail: varchar("userEmail"),
  createdAt: varchar("createdAt"),
});

// ✅ Subject Table
const Subject = pgTable("subject", {
  sub_id: serial("sub_id").primaryKey(),
  name: text("name").notNull(),
});

// ✅ Topic Table
const Topic = pgTable("topic", {
  topic_id: serial("topic_id").primaryKey(),
  topic_name: text("topic_name").notNull(),
  sub_id: integer("sub_id").notNull().references(() => Subject.sub_id),
});

// ✅ Question Table
const Question = pgTable("question", {
  que_id: serial("que_id").primaryKey(),
  text: text("text").notNull(),
  level: integer("level").notNull(),
  sub_id: integer("sub_id").notNull().references(() => Subject.sub_id),
  topic_id: integer("topic_id").notNull().references(() => Topic.topic_id),
});

// ✅ Option Table
const Option = pgTable("option", {
  opt_id: serial("opt_id").primaryKey(),
  text: text("text").notNull(),
  is_correct: boolean("is_correct").notNull(),
  que_id: integer("que_id").notNull().references(() => Question.que_id),
});

// ✅ Quiz Table
const Quiz = pgTable("quiz", {
  quiz_id: serial("quiz_id").primaryKey(),
  quiz_name: text("quiz_name").notNull(),
  sub_id: integer("sub_id").notNull().references(() => Subject.sub_id),
  std_id: text("std_id").notNull(),
});

// ✅ Student Table
const Student = pgTable("student", {
  std_id: text("std_id").primaryKey(),
  fname: text("fname").notNull(),
  lname: text("lname").notNull(),
  username: varchar("username").notNull(),
  email: text("email"),
  password: text("password"),
});

// ✅ QuizQuestion Table
const QuizQuestion = pgTable("quiz_question", {
  quiz_que_id: serial("quiz_que_id").primaryKey(),
  quiz_id: integer("quiz_id").notNull().references(() => Quiz.quiz_id),
  que_id: integer("que_id").notNull().references(() => Question.que_id),
  std_id: text("std_id").notNull(),
  selected_opt_id: integer("selected_opt_id").notNull().references(() => Option.opt_id),
});

// ✅ Export all tables
module.exports = {
  Subject,
  Topic,
  Question,
  Option,
  Quiz,
  Student,
  QuizQuestion,
  MockInterview,
  UserAnswer,
};
