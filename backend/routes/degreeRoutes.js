const express = require('express')
const router = express.Router()
const Degree = require('../models/Degree')
const protect = require('../middleware/authMiddleware')
const isAdmin = require('../middleware/adminMiddleware')
const { validateDegree } = require('../middleware/validateMiddleware')
const asyncHandler = require('../middleware/asyncHandler')

router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const showAll = req.query.all === '1' && req.student?.role === 'admin'
    const filter = showAll ? {} : { isActive: true }
    const degrees = await Degree.find(filter)
    res.json(degrees)
  }),
)

router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const degree = await Degree.findById(req.params.id)
    if (!degree) return res.status(404).json({ message: 'Degree not found' })
    if (!degree.isActive && req.student?.role !== 'admin') {
      return res.status(404).json({ message: 'Degree not found' })
    }
    res.json(degree)
  }),
)

router.post(
  '/',
  protect,
  isAdmin,
  validateDegree,
  asyncHandler(async (req, res) => {
    const degree = new Degree(req.body)
    const saved = await degree.save()
    res.status(201).json(saved)
  }),
)

router.put(
  '/:id',
  protect,
  isAdmin,
  validateDegree,
  asyncHandler(async (req, res) => {
    const degree = await Degree.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
    if (!degree) return res.status(404).json({ message: 'Degree not found' })
    res.json(degree)
  }),
)

router.delete(
  '/:id',
  protect,
  isAdmin,
  asyncHandler(async (req, res) => {
    const degree = await Degree.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true },
    )
    if (!degree) return res.status(404).json({ message: 'Degree not found' })
    res.json({ message: 'Degree deactivated', degree })
  }),
)

module.exports = router
