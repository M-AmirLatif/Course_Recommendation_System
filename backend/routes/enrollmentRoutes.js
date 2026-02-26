const express = require('express')
const router = express.Router()
const {
  enrollCourse,
  getMyEnrollments,
  updateEnrollment,
} = require('../controllers/enrollmentController')
const protect = require('../middleware/authMiddleware')

router.post('/', protect, enrollCourse)
router.get('/', protect, getMyEnrollments)
router.put('/:id', protect, updateEnrollment)

module.exports = router
