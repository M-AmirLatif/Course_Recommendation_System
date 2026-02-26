const Preference = require('../models/Preference')

// @route   POST /api/preferences
// @desc    Create student preferences
const createPreference = async (req, res) => {
  try {
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
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   GET /api/preferences
// @desc    Get student preferences
const getPreference = async (req, res) => {
  try {
    const preference = await Preference.findOne({
      student: req.student._id,
    })

    if (!preference) {
      return res.status(404).json({ message: 'No preferences found' })
    }

    res.json(preference)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

// @route   PUT /api/preferences
// @desc    Update student preferences
const updatePreference = async (req, res) => {
  try {
    const preference = await Preference.findOneAndUpdate(
      { student: req.student._id },
      req.body,
      { returnDocument: 'after' },
    )

    if (!preference) {
      return res.status(404).json({ message: 'No preferences found' })
    }

    res.json(preference)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = {
  createPreference,
  getPreference,
  updatePreference,
}
