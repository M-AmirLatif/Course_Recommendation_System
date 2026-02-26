const isAdmin = (req, res, next) => {
  if (req.student && req.student.role === 'admin') {
    next()
  } else {
    res.status(403).json({ message: 'Not authorized as admin' })
  }
}

module.exports = isAdmin
