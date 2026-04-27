const DegreeEnrollment = require('../models/DegreeEnrollment')
const Degree = require('../models/Degree')
const mongoose = require('mongoose')
const asyncHandler = require('../middleware/asyncHandler')

const MAX_DEGREE_ENROLLMENTS = 2
const ACTIVE_STATUS_QUERY = {
  $or: [{ status: 'enrolled' }, { status: { $exists: false } }],
}

const getMyDegreeEnrollments = asyncHandler(async (req, res) => {
    const enrollments = await DegreeEnrollment.find({
      student: req.student._id,
      ...ACTIVE_STATUS_QUERY,
    })
      .populate('degree', 'name shortName field duration')
      .sort({ enrolledAt: -1, updatedAt: -1 })

    res.json({
      maxAllowed: MAX_DEGREE_ENROLLMENTS,
      count: enrollments.length,
      enrollments,
    })
})

const enrollDegree = asyncHandler(async (req, res) => {
    const { degreeId } = req.params

    const degree = await Degree.findById(degreeId)
    if (!degree || !degree.isActive) {
      return res.status(404).json({ message: 'Degree not found' })
    }

    const existing = await DegreeEnrollment.findOne({
      student: req.student._id,
      degree: degreeId,
    })

    const isActive = existing && existing.status !== 'removed'
    if (isActive) {
      return res.status(400).json({ message: 'Already enrolled in this degree' })
    }

    const activeCount = await DegreeEnrollment.countDocuments({
      student: req.student._id,
      ...ACTIVE_STATUS_QUERY,
    })
    if (activeCount >= MAX_DEGREE_ENROLLMENTS) {
      return res.status(400).json({
        message: `You can enroll in maximum ${MAX_DEGREE_ENROLLMENTS} degrees`,
      })
    }

    let enrollment
    if (existing) {
      existing.status = 'enrolled'
      existing.enrolledAt = new Date()
      enrollment = await existing.save()
    } else {
      enrollment = await DegreeEnrollment.create({
        student: req.student._id,
        degree: degreeId,
        status: 'enrolled',
      })
    }

    await enrollment.populate('degree', 'name shortName field duration')

    res.status(201).json({
      message: 'Degree enrollment successful',
      enrollment,
      maxAllowed: MAX_DEGREE_ENROLLMENTS,
    })
})

const removeDegreeEnrollment = asyncHandler(async (req, res) => {
    const { degreeId } = req.params

    let enrollment = await DegreeEnrollment.findOne({
      student: req.student._id,
      degree: degreeId,
      ...ACTIVE_STATUS_QUERY,
    })

    if (!enrollment && mongoose.Types.ObjectId.isValid(degreeId)) {
      enrollment = await DegreeEnrollment.findOne({
        _id: degreeId,
        student: req.student._id,
        ...ACTIVE_STATUS_QUERY,
      })
    }

    if (!enrollment) {
      return res.status(404).json({ message: 'Degree enrollment not found' })
    }

    enrollment.status = 'removed'
    await enrollment.save()

    res.json({ message: 'Degree enrollment removed' })
})

module.exports = {
  getMyDegreeEnrollments,
  enrollDegree,
  removeDegreeEnrollment,
}
