const Course = require('../models/Course')

// ─────────────────────────────────────────
// @route   POST /api/courses
// @desc    Add a new course (admin only)
// @access  Private
// ─────────────────────────────────────────
const createCourse = async (req, res) => {
  try {
    const {
      courseCode,
      title,
      description,
      department,
      creditHours,
      difficultyLevel,
      semesterOffered,
      prerequisites,
      tags,
      careerOutcomes,
      skillsGained,
      successRate,
      averageRating,
    } = req.body

    // Check if course already exists
    const courseExists = await Course.findOne({ courseCode })
    if (courseExists) {
      return res.status(400).json({ message: 'Course already exists' })
    }

    const course = await Course.create({
      courseCode,
      title,
      description,
      department,
      creditHours,
      difficultyLevel,
      semesterOffered,
      prerequisites,
      tags,
      careerOutcomes,
      skillsGained,
      successRate,
      averageRating,
    })

    res.status(201).json(course)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────
// @route   GET /api/courses
// @desc    Get all courses
// @access  Private
// ─────────────────────────────────────────
const getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true }).populate(
      'prerequisites',
      'courseCode title',
    )
    res.json(courses)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────
// @route   GET /api/courses/:id
// @desc    Get single course by ID
// @access  Private
// ─────────────────────────────────────────
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      'prerequisites',
      'courseCode title',
    )

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    res.json(course)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────
// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private
// ─────────────────────────────────────────
const updateCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' },
    )
    res.json(updatedCourse)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// ─────────────────────────────────────────
// @route   DELETE /api/courses/:id
// @desc    Deactivate a course (soft delete)
// @access  Private
// ─────────────────────────────────────────
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    // Soft delete — just set isActive to false
    await Course.findByIdAndUpdate(req.params.id, { isActive: false })

    res.json({ message: 'Course deactivated successfully' })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
}
