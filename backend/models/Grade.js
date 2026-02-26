const mongoose = require('mongoose')

const gradeSchema = new mongoose.Schema(
  {
    // Which student
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },

    // Which course
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },

    // Grade details
    marks: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
      // actual marks obtained e.g. 78
    },
    grade: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'F'],
      required: true,
      // letter grade
    },
    gradePoints: {
      type: Number,
      min: 0,
      max: 4,
      // e.g. A=4.0, B=3.0, C=2.0, D=1.0, F=0
    },

    semester: {
      type: Number,
      required: true,
      // which semester this grade was earned
    },
    academicYear: {
      type: String,
      required: true,
      // e.g. "2024-2025"
    },
    status: {
      type: String,
      enum: ['passed', 'failed', 'incomplete'],
      required: true,
    },
  },
  { timestamps: true },
)

// A student can only have one grade per course
gradeSchema.index({ student: 1, course: 1 }, { unique: true })

module.exports = mongoose.model('Grade', gradeSchema)
