const AuditLog = require('../models/AuditLog')
const logger = require('./logger')

const recordAuditEvent = async (req, event) => {
  try {
    const actor = req.student || null

    await AuditLog.create({
      actorId: actor?._id || null,
      actorRole: actor?.role || 'anonymous',
      actorName: actor?.name || '',
      actorEmail: actor?.email || '',
      action: event.action,
      entityType: event.entityType,
      entityId: event.entityId ? String(event.entityId) : '',
      status: event.status || 'success',
      requestId: req.requestId || '',
      path: req.originalUrl || req.url || '',
      method: req.method || '',
      ip: req.ip || '',
      userAgent: req.headers['user-agent'] || '',
      metadata: event.metadata || {},
    })
  } catch (error) {
    logger.warn('Failed to record audit event', {
      requestId: req.requestId,
      error: error.message,
      action: event.action,
      entityType: event.entityType,
    })
  }
}

module.exports = {
  recordAuditEvent,
}
