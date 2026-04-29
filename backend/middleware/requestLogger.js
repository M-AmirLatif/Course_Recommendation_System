const { randomUUID } = require('crypto')
const logger = require('../utils/logger')

const requestLogger = (req, res, next) => {
  const requestId = randomUUID()
  const startedAt = Date.now()

  req.requestId = requestId
  res.setHeader('x-request-id', requestId)

  res.on('finish', () => {
    logger.info('Request completed', {
      requestId,
      method: req.method,
      path: req.originalUrl,
      statusCode: res.statusCode,
      durationMs: Date.now() - startedAt,
      ip: req.ip,
    })
  })

  next()
}

module.exports = requestLogger
