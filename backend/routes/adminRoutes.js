const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const isAdmin = require('../middleware/adminMiddleware')
const {
  getAdminSummary,
  getAllStudents,
  getAllDegreeEnrollments,
  getAuditLogs,
  updateDegreeEnrollmentStatus,
  deleteStudent,
} = require('../controllers/adminController')

router.get('/summary', protect, isAdmin, getAdminSummary)
router.get('/students', protect, isAdmin, getAllStudents)
router.get('/audit-logs', protect, isAdmin, getAuditLogs)
router.get('/degree-enrollments', protect, isAdmin, getAllDegreeEnrollments)
router.patch(
  '/degree-enrollments/:id',
  protect,
  isAdmin,
  updateDegreeEnrollmentStatus,
)
router.delete('/students/:id', protect, isAdmin, deleteStudent)

module.exports = router
