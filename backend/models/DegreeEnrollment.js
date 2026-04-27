const mongoose = require('mongoose')

const degreeEnrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true,
    },
    degree: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Degree',
      required: true,
    },
    status: {
      type: String,
      enum: ['enrolled', 'removed'],
      default: 'enrolled',
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

degreeEnrollmentSchema.index({ student: 1, degree: 1 }, { unique: true })

module.exports = mongoose.model('DegreeEnrollment', degreeEnrollmentSchema)
