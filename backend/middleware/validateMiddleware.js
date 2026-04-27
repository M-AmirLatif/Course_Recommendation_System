// Validate register input
const validateRegister = (req, res, next) => {
  const { name, email, password, studentId, educationLevel } = req.body

  if (!name || !email || !password || !studentId || !educationLevel) {
    return res.status(400).json({
      message: 'Name, email, password, student ID, and education level are required',
    })
  }

  if (password.length < 8) {
    return res.status(400).json({
      message: 'Password must be at least 8 characters',
    })
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' })
  }

  const strongPasswordRegex = /^(?=.*[A-Za-z])(?=.*\d).+$/
  if (!strongPasswordRegex.test(password)) {
    return res.status(400).json({
      message: 'Password must contain at least one letter and one number',
    })
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
  const {
    courseCode,
    title,
    description,
    department,
    creditHours,
    difficultyLevel,
  } = req.body

  if (
    !courseCode ||
    !title ||
    !description ||
    !department ||
    !creditHours ||
    !difficultyLevel
  ) {
    return res.status(400).json({
      message: 'courseCode, title, description, department, creditHours, and difficultyLevel are required',
    })
  }

  if (creditHours < 1 || creditHours > 6) {
    return res.status(400).json({
      message: 'Credit hours must be between 1 and 6',
    })
  }

  next()
}

const validateDegree = (req, res, next) => {
  const { name, field } = req.body

  if (!name || !field) {
    return res.status(400).json({
      message: 'Degree name and field are required',
    })
  }

  next()
}

module.exports = {
  validateRegister,
  validateLogin,
  validateCourse,
  validateDegree,
}
