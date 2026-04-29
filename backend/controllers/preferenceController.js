const Preference = require('../models/Preference')
const Student = require('../models/Student')
const asyncHandler = require('../middleware/asyncHandler')

// @route   POST /api/preferences
// @desc    Create student preferences
const createPreference = asyncHandler(async (req, res) => {
    // Check if preference already exists
    const exists = await Preference.findOne({ student: req.student._id })
    if (exists) {
      return res
        .status(400)
        .json({ message: 'Preference already exists, use PUT to update' })
    }

    const preference = await Preference.create({
      student: req.student._id,
      ...req.body,
    })

    res.status(201).json(preference)
})

// @route   GET /api/preferences
// @desc    Get student preferences
const getPreference = asyncHandler(async (req, res) => {
    const preference = await Preference.findOne({
      student: req.student._id,
    })

    if (!preference) {
      return res.json({
        student: req.student._id,
        likedDegrees: [],
        dislikedDegrees: [],
      })
    }

    res.json(preference)
})

// @route   POST /api/preferences/degree-feedback
// @desc    Like/dislike/clear a degree recommendation
const setDegreeFeedback = asyncHandler(async (req, res) => {
    const { degreeId, action } = req.body

    if (!degreeId || !['like', 'dislike', 'clear'].includes(action)) {
      return res.status(400).json({
        message: 'degreeId and valid action (like/dislike/clear) are required',
      })
    }

    let preference = await Preference.findOne({ student: req.student._id })

    if (!preference) {
      preference = await Preference.create({
        student: req.student._id,
        likedDegrees: [],
        dislikedDegrees: [],
      })
    }

    const id = degreeId.toString()
    const liked = (preference.likedDegrees || []).map((d) => d.toString())
    const disliked = (preference.dislikedDegrees || []).map((d) => d.toString())

    const nextLiked = liked.filter((d) => d !== id)
    const nextDisliked = disliked.filter((d) => d !== id)

    if (action === 'like') nextLiked.push(id)
    if (action === 'dislike') nextDisliked.push(id)

    preference.likedDegrees = [...new Set(nextLiked)]
    preference.dislikedDegrees = [...new Set(nextDisliked)]
    await preference.save()
    await Student.findByIdAndUpdate(req.student._id, {
      likedDegrees: preference.likedDegrees,
      dislikedDegrees: preference.dislikedDegrees,
    })

    res.json({
      message: 'Degree feedback updated',
      likedDegrees: preference.likedDegrees,
      dislikedDegrees: preference.dislikedDegrees,
    })
})

// @route   PUT /api/preferences
// @desc    Update student preferences
const updatePreference = asyncHandler(async (req, res) => {
    const preference = await Preference.findOneAndUpdate(
      { student: req.student._id },
      req.body,
      { returnDocument: 'after' },
    )

    if (!preference) {
      return res.status(404).json({ message: 'No preferences found' })
    }

    res.json(preference)
})

module.exports = {
  createPreference,
  getPreference,
  updatePreference,
  setDegreeFeedback,
}
