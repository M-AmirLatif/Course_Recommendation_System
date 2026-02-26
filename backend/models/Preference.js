const mongoose = require('mongoose')

const preferenceSchema = new mongoose.Schema(
  {
    // Which student these preferences belong to
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
      unique: true,
      // one preference profile per student
    },

    // Career & interest preferences
    preferredCareerPaths: [
      {
        type: String,
        // e.g. ["Data Scientist", "Web Developer", "Game Developer"]
      },
    ],
    preferredSubjects: [
      {
        type: String,
        // e.g. ["Mathematics", "Programming", "Design"]
      },
    ],
    preferredSkills: [
      {
        type: String,
        // e.g. ["Python", "React", "Machine Learning"]
      },
    ],

    // Learning style preferences
    preferredDifficulty: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
      // what difficulty level student is comfortable with
    },
    preferredCreditHours: {
      type: Number,
      min: 1,
      max: 6,
      default: 3,
      // how many credit hours student prefers per course
    },
    availableTimePerWeek: {
      type: Number,
      default: 10,
      // hours per week student can dedicate e.g. 10
    },

    // Courses student explicitly liked or disliked
    // (from recommendation feedback buttons)
    likedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        // courses student clicked "interested" on
      },
    ],
    dislikedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        // courses student clicked "not interested" on
      },
    ],

    // Goals
    shortTermGoal: {
      type: String,
      // e.g. "Get an internship in 6 months"
    },
    longTermGoal: {
      type: String,
      // e.g. "Become a Machine Learning Engineer"
    },
  },
  { timestamps: true },
)

module.exports = mongoose.model('Preference', preferenceSchema)
