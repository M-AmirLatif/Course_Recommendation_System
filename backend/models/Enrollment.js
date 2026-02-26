const mongoose = require('mongoose')

const enrollmentSchema = new mongoose.Schema(
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

    // Enrollment details
    semester: {
      type: Number,
      required: true,
      // which semester student enrolled in this course
    },
    academicYear: {
      type: String,
      required: true,
      // e.g. "2024-2025"
    },
    status: {
      type: String,
      enum: ['enrolled', 'completed', 'dropped', 'failed'],
      default: 'enrolled',
      // track current state of enrollment
    },
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    completionDate: {
      type: Date,
      // filled when student completes the course
    },

    // Feedback after course completion
    feedback: {
      rating: {
        type: Number,
        min: 1,
        max: 5,
        // student rates the course 1-5
      },
      comment: {
        type: String,
        // optional written feedback
      },
      wouldRecommend: {
        type: Boolean,
        // did student find it useful?
      },
    },
  },
  { timestamps: true },
)

// A student can only enroll once in a course per academic year
enrollmentSchema.index(
  { student: 1, course: 1, academicYear: 1 },
  { unique: true },
)

module.exports = mongoose.model('Enrollment', enrollmentSchema)
