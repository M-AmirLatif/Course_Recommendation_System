const mongoose = require('mongoose')

const courseOutcomeSchema = new mongoose.Schema(
  {
    // Which course these outcomes belong to
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      unique: true,
      // one outcome profile per course
    },

    // What student will learn
    learningObjectives: [
      {
        type: String,
        // e.g. ["Understand neural networks",
        //        "Build ML models", "Use Python libraries"]
      },
    ],

    // Industry relevance
    industryDemand: {
      type: String,
      enum: ['low', 'medium', 'high', 'very high'],
      default: 'medium',
      // how in-demand are these skills in job market
    },
    relatedJobTitles: [
      {
        type: String,
        // e.g. ["Data Scientist", "ML Engineer", "AI Researcher"]
      },
    ],
    averageSalaryRange: {
      min: { type: Number },
      max: { type: Number },
      // e.g. min: 60000, max: 120000 (annual salary in USD)
    },

    // How this course connects to others
    recommendedNextCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        // after completing this, take these courses next
      },
    ],
    complementaryCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        // courses that go well alongside this one
      },
    ],

    // Real world applications
    realWorldApplications: [
      {
        type: String,
        // e.g. ["Building recommendation systems",
        //        "Image recognition", "Fraud detection"]
      },
    ],
    toolsAndTechnologies: [
      {
        type: String,
        // e.g. ["Python", "TensorFlow", "Scikit-learn", "Pandas"]
      },
    ],
  },
  { timestamps: true },
)

module.exports = mongoose.model('CourseOutcome', courseOutcomeSchema)
