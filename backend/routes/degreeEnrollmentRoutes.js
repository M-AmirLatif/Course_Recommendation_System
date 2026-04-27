const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const {
  getMyDegreeEnrollments,
  enrollDegree,
  removeDegreeEnrollment,
} = require('../controllers/degreeEnrollmentController')

router.get('/', protect, getMyDegreeEnrollments)
router.post('/:degreeId', protect, enrollDegree)
router.delete('/:degreeId', protect, removeDegreeEnrollment)

module.exports = router
