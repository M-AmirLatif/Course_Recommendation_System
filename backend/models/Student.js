const mongoose = require('mongoose')

const studentSchema = new mongoose.Schema(
  {
    // ── BASIC INFO ─────────────────────────────
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    studentId: { type: String, required: true, unique: true },
    role: { type: String, enum: ['student', 'admin'], default: 'student' },

    // ── ACADEMIC BACKGROUND ────────────────────
    educationLevel: {
      type: String,
      enum: ['matric', 'intermediate', 'bachelor', 'master'],
      default: 'intermediate',
    },
    previousQualification: {
      type: String,
      // e.g. "FSc Pre-Engineering", "ICS", "A-Levels", "O-Levels", "BCom"
    },
    majorStream: {
      type: String,
      enum: ['science', 'commerce', 'arts', 'technology', 'other'],
      default: 'science',
    },
    subjectsStudied: [
      {
        type: String,
        // e.g. ["Mathematics", "Physics", "Computer", "Biology", "Chemistry"]
      },
    ],
    strongSubjects: [
      {
        type: String,
        // subjects student is strong in
      },
    ],
    gpa: {
      type: Number,
      min: 0,
      max: 4,
      default: 0,
    },
    // Keep cgpa for backward compatibility
    cgpa: {
      type: Number,
      min: 0,
      max: 4,
      default: 0,
    },

    // ── INTERESTS ──────────────────────────────
    interestAreas: [
      {
        type: String,
        // e.g. ["Technology", "Business", "Healthcare", "Arts", "Law", "Engineering"]
      },
    ],
    preferredActivities: [
      {
        type: String,
        // e.g. ["Problem Solving", "Creativity", "Communication", "Research", "Fieldwork"]
      },
    ],

    // ── SKILLS & PERSONALITY ───────────────────
    analyticalSkills: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    communicationSkills: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    creativityLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    workPreference: {
      type: String,
      enum: ['theory', 'practical', 'both'],
      default: 'both',
    },
    teamPreference: {
      type: String,
      enum: ['team', 'individual', 'both'],
      default: 'both',
    },

    // ── CAREER GOALS ───────────────────────────
    careerGoal: {
      type: String,
      // e.g. "Software Engineer", "Doctor", "Businessman", "Designer"
    },
    workEnvironment: {
      type: String,
      enum: ['office', 'field', 'remote', 'any'],
      default: 'any',
    },

    // ── CONSTRAINTS ────────────────────────────
    budget: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    studyLocation: {
      type: String,
      enum: ['local', 'abroad', 'online', 'any'],
      default: 'any',
    },
    needsScholarship: {
      type: Boolean,
      default: false,
    },

    // ── LEGACY FIELDS (kept for compatibility) ─
    department: { type: String, default: 'General' },
    semester: { type: Number, default: 1 },
    skillLevel: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
    interests: [{ type: String }],
  },
  { timestamps: true },
)

module.exports = mongoose.model('Student', studentSchema)
