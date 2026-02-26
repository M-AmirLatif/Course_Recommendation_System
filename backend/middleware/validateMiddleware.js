// Validate register input
const validateRegister = (req, res, next) => {
  const { name, email, password, studentId, department, semester } = req.body

  if (!name || !email || !password || !studentId || !department || !semester) {
    return res.status(400).json({ message: 'All fields are required' })
  }

  if (password.length < 6) {
    return res.status(400).json({
      message: 'Password must be at least 6 characters',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  if (semester < 1 || semester > 8) {
    return res.status(400).json({ message: 'Semester must be between 1 and 8' })
  }

  next()
}

// Validate login input
const validateLogin = (req, res, next) => {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  next()
}

// Validate course input
const validateCourse = (req, res, next) => {
  const { courseCode, title, department, creditHours, difficultyLevel } =
    req.body

  if (
    !courseCode ||
    !title ||
    !department ||
    !creditHours ||
    !difficultyLevel
  ) {
    return res.status(400).json({ message: 'All course fields are required' })
  }

  if (creditHours < 1 || creditHours > 6) {
    return res.status(400).json({
      message: 'Credit hours must be between 1 and 6',
    })
  }

  next()
}

module.exports = { validateRegister, validateLogin, validateCourse }
