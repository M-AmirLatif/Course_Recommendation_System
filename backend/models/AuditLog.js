const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      default: null,
      index: true,
    },
    actorRole: {
      type: String,
      default: 'anonymous',
      trim: true,
    },
    actorName: {
      type: String,
      default: '',
      trim: true,
    },
    actorEmail: {
      type: String,
      default: '',
      trim: true,
      lowercase: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    entityId: {
      type: String,
      default: '',
      trim: true,
    },
    status: {
      type: String,
      default: 'success',
      trim: true,
      index: true,
    },
    requestId: {
      type: String,
      default: '',
      trim: true,
      index: true,
    },
    path: {
      type: String,
      default: '',
      trim: true,
    },
    method: {
      type: String,
      default: '',
      trim: true,
    },
    ip: {
      type: String,
      default: '',
      trim: true,
    },
    userAgent: {
      type: String,
      default: '',
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  },
)

auditLogSchema.index({ createdAt: -1 })

module.exports = mongoose.model('AuditLog', auditLogSchema)
