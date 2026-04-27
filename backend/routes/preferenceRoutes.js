const express = require('express')
const router = express.Router()
const {
  createPreference,
  getPreference,
  updatePreference,
  setDegreeFeedback,
} = require('../controllers/preferenceController')
const protect = require('../middleware/authMiddleware')

router.post('/', protect, createPreference)
router.get('/', protect, getPreference)
router.put('/', protect, updatePreference)
router.post('/degree-feedback', protect, setDegreeFeedback)

module.exports = router
