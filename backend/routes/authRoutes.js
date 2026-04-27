const express = require('express')
const router = express.Router()
const {
  registerStudent,
  loginStudent,
  getProfile,
  makeAdmin,
} = require('../controllers/authController')

const protect = require('../middleware/authMiddleware')
const isAdmin = require('../middleware/adminMiddleware')
const {
  validateRegister,
  validateLogin,
} = require('../middleware/validateMiddleware')

// Public routes
router.post('/register', validateRegister, registerStudent)
router.post('/login', validateLogin, loginStudent)

// Protected routes
router.get('/profile', protect, getProfile)
router.put('/make-admin/:id', protect, isAdmin, makeAdmin)

module.exports = router
