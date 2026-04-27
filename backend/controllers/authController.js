const Student = require('../models/Student')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const asyncHandler = require('../middleware/asyncHandler')

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  })
}

// ─────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
// ─────────────────────────────────────────
const registerStudent = asyncHandler(async (req, res) => {
    const {
      name,
      email,
      password,
      studentId,
      department,
      semester,
      interests,
      careerGoal,
      skillLevel,
      educationLevel,
      previousQualification,
      majorStream,
      subjectsStudied,
      strongSubjects,
      gpa,
      cgpa,
      interestAreas,
      preferredActivities,
      analyticalSkills,
      communicationSkills,
      creativityLevel,
      workPreference,
      teamPreference,
      workEnvironment,
      budget,
      studyLocation,
      needsScholarship,
    } = req.body

    // Check if student already exists
    const normalizedEmail = String(email || '').trim().toLowerCase()
    const normalizedStudentId = String(studentId || '').trim()

    const studentExists = await Student.findOne({
      $or: [{ email: normalizedEmail }, { studentId: normalizedStudentId }],
    })
    if (studentExists) {
      return res.status(409).json({
        message:
          studentExists.email === normalizedEmail
            ? 'A student with this email already exists'
            : 'A student with this student ID already exists',
      })
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new student
    const student = await Student.create({
      name,
      email: normalizedEmail,
      password: hashedPassword,
      studentId: normalizedStudentId,
      department,
      semester,
      interests,
      careerGoal,
      skillLevel,
      educationLevel,
      previousQualification,
      majorStream,
      subjectsStudied,
      strongSubjects,
      gpa,
      cgpa,
      interestAreas,
      preferredActivities,
      analyticalSkills,
      communicationSkills,
      creativityLevel,
      workPreference,
      teamPreference,
      workEnvironment,
      budget,
      studyLocation,
      needsScholarship,
    })

    if (student) {
      res.status(201).json({
        _id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
        role: student.role,
        token: generateToken(student._id),
      })
    }
})

// ─────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login student & get token
// @access  Public
// ─────────────────────────────────────────
const loginStudent = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const normalizedEmail = String(email || '').trim().toLowerCase()

    // Find student by email
    const student = await Student.findOne({ email: normalizedEmail })

    if (!student) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, student.password)

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' })
    }

    res.json({
      _id: student._id,
      name: student.name,
      email: student.email,
      studentId: student.studentId,
      department: student.department,
      semester: student.semester,
      role: student.role,
      token: generateToken(student._id),
    })
})

// ─────────────────────────────────────────
// @route   GET /api/auth/profile
// @desc    Get logged in student profile
// @access  Private
// ─────────────────────────────────────────
const getProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.student._id).select('-password')
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    res.json(student)
})

// ─────────────────────────────────────────
// @route   PUT /api/auth/make-admin/:id
// @desc    Make a user admin
// @access  Private
// ─────────────────────────────────────────
const makeAdmin = asyncHandler(async (req, res) => {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { returnDocument: 'after' },
    )

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json({ message: 'User updated to admin', role: student.role })
})

module.exports = {
  registerStudent,
  loginStudent,
  getProfile,
  makeAdmin,
}
