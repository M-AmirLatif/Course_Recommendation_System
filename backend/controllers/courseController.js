const Course = require('../models/Course')
const Degree = require('../models/Degree')
const asyncHandler = require('../middleware/asyncHandler')

// ─────────────────────────────────────────
// @route   POST /api/courses
// @desc    Add a new course (admin only)
// @access  Private
// ─────────────────────────────────────────
const createCourse = asyncHandler(async (req, res) => {
    const {
      courseCode,
      title,
      description,
      department,
      degreeId,
      creditHours,
      difficultyLevel,
      semesterOffered,
      prerequisites,
      tags,
      careerOutcomes,
      skillsGained,
      successRate,
      averageRating,
      isCore,
      category,
      relevantSubjects,
      skillTags,
      careerTags,
    } = req.body

    // Check if course already exists
    const courseExists = await Course.findOne({ courseCode })
    if (courseExists) {
      return res.status(409).json({ message: 'Course already exists' })
    }

    let degreeRef = null
    if (degreeId) {
      const degree = await Degree.findById(degreeId)
      if (!degree) {
        return res.status(404).json({ message: 'Degree not found for course' })
      }
      degreeRef = degree._id
    }

    const normalizedTags = tags || []
    const normalizedSkills = skillsGained || []
    const normalizedCareers = careerOutcomes || []
    const normalizedCategory = category || (Boolean(isCore) ? 'core' : 'elective')
    const normalizedRelevantSubjects = relevantSubjects || normalizedTags
    const normalizedSkillTags = skillTags || normalizedSkills
    const normalizedCareerTags = careerTags || normalizedCareers

    const course = await Course.create({
      courseCode,
      title,
      description,
      department,
      degree: degreeRef,
      creditHours,
      difficultyLevel,
      semesterOffered,
      prerequisites,
      tags: normalizedTags,
      careerOutcomes: normalizedCareers,
      skillsGained: normalizedSkills,
      successRate,
      averageRating,
      isCore: Boolean(isCore),
      category: normalizedCategory,
      relevantSubjects: normalizedRelevantSubjects,
      skillTags: normalizedSkillTags,
      careerTags: normalizedCareerTags,
    })

    res.status(201).json(course)
})

// ─────────────────────────────────────────
// @route   GET /api/courses
// @desc    Get all courses
// @access  Private
// ─────────────────────────────────────────
const getAllCourses = asyncHandler(async (req, res) => {
    const filter = {}
    const includeAll = req.query.all === '1' && req.student?.role === 'admin'
    if (!includeAll) {
      filter.isActive = true
    }
    if (req.query.degreeId) {
      filter.degree = req.query.degreeId
    }

    const courses = await Course.find(filter)
      .populate('prerequisites', 'courseCode title')
      .populate('degree', 'name shortName field')
    res.json(courses)
})

// ─────────────────────────────────────────
// @route   GET /api/courses/:id
// @desc    Get single course by ID
// @access  Private
// ─────────────────────────────────────────
const getCourseById = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id).populate(
      'prerequisites',
      'courseCode title',
    )

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    res.json(course)
})

// ─────────────────────────────────────────
// @route   PUT /api/courses/:id
// @desc    Update a course
// @access  Private
// ─────────────────────────────────────────
const updateCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    let payload = { ...req.body }
    if (payload.degreeId) {
      const degree = await Degree.findById(payload.degreeId)
      if (!degree) {
        return res.status(404).json({ message: 'Degree not found for course' })
      }
      payload.degree = degree._id
      delete payload.degreeId
    }

    if (payload.tags && !payload.relevantSubjects) {
      payload.relevantSubjects = payload.tags
    }
    if (payload.skillsGained && !payload.skillTags) {
      payload.skillTags = payload.skillsGained
    }
    if (payload.careerOutcomes && !payload.careerTags) {
      payload.careerTags = payload.careerOutcomes
    }
    if (payload.category && payload.isCore === undefined) {
      payload.isCore = payload.category === 'core'
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, payload, {
      returnDocument: 'after',
      runValidators: true,
    })
    res.json(updatedCourse)
})

// ─────────────────────────────────────────
// @route   DELETE /api/courses/:id
// @desc    Deactivate a course (soft delete)
// @access  Private
// ─────────────────────────────────────────
const deleteCourse = asyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id)

    if (!course) {
      return res.status(404).json({ message: 'Course not found' })
    }

    // Soft delete — just set isActive to false
    await Course.findByIdAndUpdate(req.params.id, { isActive: false })

    res.json({ message: 'Course deactivated successfully' })
})

module.exports = {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
}
