const express = require('express')
const router = express.Router()
const {
  createCourse,
  getAllCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
} = require('../controllers/courseController')
const protect = require('../middleware/authMiddleware')
const { validateCourse } = require('../middleware/validateMiddleware')

router.post('/', protect, validateCourse, createCourse)
router.get('/', protect, getAllCourses)
router.get('/:id', protect, getCourseById)
router.put('/:id', protect, updateCourse)
router.delete('/:id', protect, deleteCourse)

module.exports = router
