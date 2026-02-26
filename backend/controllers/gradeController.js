const Grade = require('../models/Grade')
const Course = require('../models/Course')
const Enrollment = require('../models/Enrollment')
const Student = require('../models/Student')

// @route   POST /api/grades
// @desc    Add grade for a course
const addGrade = async (req, res) => {
  try {
    const { courseId, marks, semester, academicYear } = req.body

    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const gradeExists = await Grade.findOne({
      student: req.student._id,
      course: courseId,
    })
    if (gradeExists) {
      return res
        .status(400)
        .json({ message: 'Grade already added for this course' })
    }

    // Calculate letter grade and grade points
    let grade, gradePoints, status
    if (marks >= 85) {
      grade = 'A'
      gradePoints = 4.0
      status = 'passed'
    } else if (marks >= 70) {
      grade = 'B'
      gradePoints = 3.0
      status = 'passed'
    } else if (marks >= 55) {
      grade = 'C'
      gradePoints = 2.0
      status = 'passed'
    } else if (marks >= 40) {
      grade = 'D'
      gradePoints = 1.0
      status = 'passed'
    } else {
      grade = 'F'
      gradePoints = 0
      status = 'failed'
    }

    const newGrade = await Grade.create({
      student: req.student._id,
      course: courseId,
      marks,
      grade,
      gradePoints,
      semester,
      academicYear,
      status,
    })

    // Update enrollment status
    await Enrollment.findOneAndUpdate(
      { student: req.student._id, course: courseId },
      {
        status: status === 'passed' ? 'completed' : 'failed',
        completionDate: Date.now(),
      },
    )

    // ── AUTO UPDATE CGPA ──────────────────────
    const allGrades = await Grade.find({ student: req.student._id })
    const totalPoints = allGrades.reduce((sum, g) => sum + g.gradePoints, 0)
    const cgpa = (totalPoints / allGrades.length).toFixed(2)

    await Student.findByIdAndUpdate(req.student._id, { cgpa })
    // ─────────────────────────────────────────

    res.status(201).json({
      ...newGrade.toObject(),
      cgpa: parseFloat(cgpa),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   GET /api/grades
// @desc    Get all grades of logged in student
const getMyGrades = async (req, res) => {
  try {
    const grades = await Grade.find({
      student: req.student._id,
    }).populate('course', 'courseCode title creditHours')

    // Calculate CGPA
    const totalPoints = grades.reduce((sum, g) => sum + g.gradePoints, 0)
    const cgpa =
      grades.length > 0 ? (totalPoints / grades.length).toFixed(2) : 0

    res.json({
      cgpa,
      totalCourses: grades.length,
      grades,
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { addGrade, getMyGrades }
