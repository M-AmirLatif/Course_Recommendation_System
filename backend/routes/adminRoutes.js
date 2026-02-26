const express = require('express')
const router = express.Router()
const protect = require('../middleware/authMiddleware')
const isAdmin = require('../middleware/adminMiddleware')
const {
  getAllStudents,
  getAllEnrollments,
  deleteStudent,
} = require('../controllers/adminController')

router.get('/students', protect, isAdmin, getAllStudents)
router.get('/enrollments', protect, isAdmin, getAllEnrollments)
router.delete('/students/:id', protect, isAdmin, deleteStudent)

module.exports = router
