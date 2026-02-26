const Student = require('../models/Student')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  })
}

// ─────────────────────────────────────────
// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
// ─────────────────────────────────────────
const registerStudent = async (req, res) => {
  try {
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
    } = req.body

    // Check if student already exists
    const studentExists = await Student.findOne({ email })
    if (studentExists) {
      return res.status(400).json({ message: 'Student already exists' })
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Create new student
    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
      studentId,
      department,
      semester,
      interests,
      careerGoal,
      skillLevel,
    })

    if (student) {
      res.status(201).json({
        _id: student._id,
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        department: student.department,
        semester: student.semester,
        token: generateToken(student._id),
      })
    }
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────
// @route   POST /api/auth/login
// @desc    Login student & get token
// @access  Public
// ─────────────────────────────────────────
const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body

    // Find student by email
    const student = await Student.findOne({ email })

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
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────
// @route   GET /api/auth/profile
// @desc    Get logged in student profile
// @access  Private
// ─────────────────────────────────────────
const getProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id).select('-password')
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    res.json(student)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────
// @route   PUT /api/auth/make-admin/:id
// @desc    Make a user admin
// @access  Private
// ─────────────────────────────────────────
const makeAdmin = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { role: 'admin' },
      { returnDocument: 'after' },
    )

    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    res.json({ message: 'User updated to admin', role: student.role })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  registerStudent,
  loginStudent,
  getProfile,
  makeAdmin,
}
