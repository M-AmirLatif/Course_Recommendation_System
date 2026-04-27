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

    // Degree feedback (new degree recommender)
    likedDegrees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Degree' }],
    dislikedDegrees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Degree' }],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Preference', preferenceSchema)
