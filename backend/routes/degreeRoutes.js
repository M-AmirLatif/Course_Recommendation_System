const express = require('express')
const router = express.Router()
const Degree = require('../models/Degree')
const { protect, adminOnly } = require('../middleware/authMiddleware')

// GET all degrees (public - students can view)
router.get('/', protect, async (req, res) => {
  try {
    const degrees = await Degree.find({ isActive: true })
    res.json(degrees)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// GET single degree
router.get('/:id', protect, async (req, res) => {
  try {
    const degree = await Degree.findById(req.params.id)
    if (!degree) return res.status(404).json({ message: 'Degree not found' })
    res.json(degree)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

// POST create degree (admin only)
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const degree = new Degree(req.body)
    const saved = await degree.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// PUT update degree (admin only)
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const degree = await Degree.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!degree) return res.status(404).json({ message: 'Degree not found' })
    res.json(degree)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

// DELETE degree (admin only)
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Degree.findByIdAndDelete(req.params.id)
    res.json({ message: 'Degree deleted successfully' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
