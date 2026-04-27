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
const isAdmin = require('../middleware/adminMiddleware')
const { validateCourse } = require('../middleware/validateMiddleware')

router.post('/', protect, isAdmin, validateCourse, createCourse)
router.get('/', protect, getAllCourses)
router.get('/:id', protect, getCourseById)
router.put('/:id', protect, isAdmin, validateCourse, updateCourse)
router.delete('/:id', protect, isAdmin, deleteCourse)

module.exports = router
