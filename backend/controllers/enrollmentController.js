const Enrollment = require('../models/Enrollment')
const Course = require('../models/Course')

// @route   POST /api/enrollments
// @desc    Enroll student in a course
const enrollCourse = async (req, res) => {
  try {
    const { courseId, semester, academicYear } = req.body

    // Check if course exists
    const course = await Course.findById(courseId)
    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    // Check if already enrolled
    const alreadyEnrolled = await Enrollment.findOne({
      student: req.student._id,
      course: courseId,
      academicYear,
    })
    if (alreadyEnrolled) {
      return res
        .status(400)
        .json({ message: 'Already enrolled in this course' })
    }

    const enrollment = await Enrollment.create({
      student: req.student._id,
      course: courseId,
      semester,
      academicYear,
      status: 'enrolled',
    })

    // Increase course enrollment count
    await Course.findByIdAndUpdate(courseId, {
      $inc: { totalEnrollments: 1 },
    })

    res.status(201).json(enrollment)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   GET /api/enrollments
// @desc    Get all enrollments of logged in student
const getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      student: req.student._id,
    }).populate('course', 'courseCode title difficultyLevel creditHours')

    res.json(enrollments)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   PUT /api/enrollments/:id
// @desc    Update enrollment status + add feedback
const updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.id)

    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' })
    }

    // Make sure student owns this enrollment
    if (enrollment.student.toString() !== req.student._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' })
    }

    const updated = await Enrollment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' },
    )

    res.json(updated)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  enrollCourse,
  getMyEnrollments,
  updateEnrollment,
}
