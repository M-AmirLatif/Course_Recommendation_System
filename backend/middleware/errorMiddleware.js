const mongoose = require('mongoose')
const logger = require('../utils/logger')

const notFound = (req, res, next) => {
  const error = new Error(`Route ${req.originalUrl} not found`)
  error.statusCode = 404
  next(error)
}

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode >= 400 ? res.statusCode : 500
  let message = err.message || 'Internal server error'

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400
    message = Object.values(err.errors)
      .map((entry) => entry.message)
      .join(', ')
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400
    message = `Invalid ${err.path}`
  } else if (
    err.name === 'JsonWebTokenError' ||
    err.name === 'TokenExpiredError'
  ) {
    statusCode = 401
    message = 'Not authorized, token is invalid or expired'
  } else if (err.code === 11000) {
    statusCode = 409
    const duplicateField = Object.keys(err.keyPattern || {})[0] || 'resource'
    message = `${duplicateField} already exists`
  } else if (err.statusCode) {
    statusCode = err.statusCode
  }

  res.status(statusCode).json({
    message,
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  })

  logger.error('Request failed', {
    requestId: req.requestId,
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: err.message,
    stack: process.env.NODE_ENV !== 'production' ? err.stack : undefined,
  })
}

module.exports = {
  notFound,
  errorHandler,
}
