const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
  {
    // Basic login info
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Academic info
    studentId: {
      type: String,
      required: true,
      unique: true,
    },
    department: {
      type: String,
      required: true,
      // e.g. "Computer Science", "Business", "Engineering"
    },
    semester: {
      type: Number,
      required: true,
      // e.g. 1 to 8
    },
    cgpa: {
      type: Number,
      min: 0,
      max: 4,
      default: 0,
      // overall GPA, used by recommendation engine
    },

    // Interests & career goals (used by AI engine)
    interests: [
      {
        type: String,
        // e.g. ["Machine Learning", "Web Dev", "Data Science"]
      },
    ],
    careerGoal: {
      type: String,
      // e.g. "Software Engineer", "Data Analyst", "Entrepreneur"
    },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },

    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
  },
  { timestamps: true },
)
// timestamps automatically adds createdAt and updatedAt

module.exports = mongoose.model('Student', studentSchema)
