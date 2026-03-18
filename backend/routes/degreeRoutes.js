const express = require('express')
const router = express.Router()
const Degree = require('../models/Degree')
const jwt = require('jsonwebtoken')
const Student = require('../models/Student')

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ message: 'Not authorized' })
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = await Student.findById(decoded.id).select('-password')
    next()
  } catch (err) {
    res.status(401).json({ message: 'Token invalid' })
  }
}

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') return next()
  res.status(403).json({ message: 'Admin access required' })
}

router.get('/', protect, async (req, res) => {
  try {
    const degrees = await Degree.find({ isActive: true })
    res.json(degrees)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.get('/:id', protect, async (req, res) => {
  try {
    const degree = await Degree.findById(req.params.id)
    if (!degree) return res.status(404).json({ message: 'Degree not found' })
    res.json(degree)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const degree = new Degree(req.body)
    const saved = await degree.save()
    res.status(201).json(saved)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const degree = await Degree.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    })
    if (!degree) return res.status(404).json({ message: 'Degree not found' })
    res.json(degree)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
})

router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await Degree.findByIdAndDelete(req.params.id)
    res.json({ message: 'Degree deleted' })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
})

module.exports = router
