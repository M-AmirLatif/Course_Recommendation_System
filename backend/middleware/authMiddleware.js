const jwt = require('jsonwebtoken')
const Student = require('../models/Student')

const protect = async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.student = await Student.findById(decoded.id).select('-password')
      if (!req.student) {
        return res.status(401).json({ message: 'Not authorized, user not found' })
      }
      next()
      return
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' })
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' })
  }
}

module.exports = protect
