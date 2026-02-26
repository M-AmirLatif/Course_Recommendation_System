const express = require('express')
const router = express.Router()
const { addGrade, getMyGrades } = require('../controllers/gradeController')
const protect = require('../middleware/authMiddleware')

router.post('/', protect, addGrade)
router.get('/', protect, getMyGrades)

module.exports = router
