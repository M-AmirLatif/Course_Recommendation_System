const Student = require('../models/Student')
const Enrollment = require('../models/Enrollment')

// Get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find({ role: 'student' }).select('-password')
    res.json(students)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Get all enrollments
const getAllEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find()
      .populate('student', 'name email studentId')
      .populate('course', 'courseCode title')
    res.json(enrollments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// Delete student
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }
    await Student.findByIdAndDelete(req.params.id)
    res.json({ message: 'Student deleted successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  getAllStudents,
  getAllEnrollments,
  deleteStudent,
}
