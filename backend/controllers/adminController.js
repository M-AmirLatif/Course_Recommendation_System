const Student = require('../models/Student')
const Degree = require('../models/Degree')
const Preference = require('../models/Preference')
const DegreeEnrollment = require('../models/DegreeEnrollment')
const AuditLog = require('../models/AuditLog')
const asyncHandler = require('../middleware/asyncHandler')
const { recordAuditEvent } = require('../utils/auditLogger')

const ACTIVE_STATUS_QUERY = {
  $or: [{ status: 'enrolled' }, { status: 'active' }, { status: { $exists: false } }],
}

const getAllStudents = asyncHandler(async (req, res) => {
    const [students, enrollmentCounts] = await Promise.all([
      Student.find({ role: 'student' }).select('-password').sort({ createdAt: -1 }).lean(),
      DegreeEnrollment.aggregate([
        { $match: ACTIVE_STATUS_QUERY },
        {
          $group: {
            _id: '$student',
            activeDegreeEnrollments: { $sum: 1 },
            latestDegreeEnrollmentAt: { $max: '$enrolledAt' },
          },
        },
      ]),
    ])

    const enrollmentMap = new Map(
      enrollmentCounts.map((entry) => [String(entry._id), entry]),
    )

    const enrichedStudents = students.map((student) => {
      const stats = enrollmentMap.get(String(student._id))
      return {
        ...student,
        activeDegreeEnrollments: stats?.activeDegreeEnrollments || 0,
        latestDegreeEnrollmentAt: stats?.latestDegreeEnrollmentAt || null,
      }
    })

    res.json(enrichedStudents)
})

const getAllDegreeEnrollments = asyncHandler(async (req, res) => {
    const status = (req.query.status || 'enrolled').toLowerCase()
    const allowed = new Set(['enrolled', 'removed', 'all'])
    if (!allowed.has(status)) {
      return res.status(400).json({ message: 'Invalid enrollment status filter' })
    }

    const filter =
      status === 'all'
        ? {}
        : status === 'enrolled'
          ? ACTIVE_STATUS_QUERY
          : { status }

    const enrollments = await DegreeEnrollment.find(filter)
      .populate(
        'student',
        'name email studentId majorStream careerGoal budget needsScholarship',
      )
      .populate('degree', 'name shortName field duration')
      .sort({ enrolledAt: -1, updatedAt: -1 })
      .lean()

    res.json(enrollments)
})

const updateDegreeEnrollmentStatus = asyncHandler(async (req, res) => {
    const { status } = req.body
    const allowed = new Set(['enrolled', 'removed'])
    if (!allowed.has(status)) {
      return res.status(400).json({ message: 'Invalid enrollment status' })
    }

    const enrollment = await DegreeEnrollment.findById(req.params.id)
      .populate(
        'student',
        'name email studentId majorStream careerGoal budget needsScholarship',
      )
      .populate('degree', 'name shortName field duration')

    if (!enrollment) {
      return res.status(404).json({ message: 'Degree enrollment not found' })
    }

    enrollment.status = status
    if (status === 'enrolled') {
      enrollment.enrolledAt = new Date()
    }

    await enrollment.save()
    await recordAuditEvent(req, {
      action: 'admin.degree_enrollment.status_updated',
      entityType: 'DegreeEnrollment',
      entityId: enrollment._id,
      metadata: {
        status,
        studentId: enrollment.student?._id || enrollment.student,
        degreeId: enrollment.degree?._id || enrollment.degree,
      },
    })
    res.json({ message: 'Degree enrollment updated', enrollment })
})

const getAdminSummary = asyncHandler(async (req, res) => {
    const [
      totalDegrees,
      activeDegrees,
      totalStudents,
      totalDegreeEnrollments,
      scholarshipSeekingStudents,
      recentEnrollments,
      recentStudents,
      degreesByField,
    ] = await Promise.all([
      Degree.countDocuments(),
      Degree.countDocuments({ isActive: true }),
      Student.countDocuments({ role: 'student' }),
      DegreeEnrollment.countDocuments(ACTIVE_STATUS_QUERY),
      Student.countDocuments({ role: 'student', needsScholarship: true }),
      DegreeEnrollment.find(ACTIVE_STATUS_QUERY)
        .populate('student', 'name studentId')
        .populate('degree', 'name shortName field')
        .sort({ enrolledAt: -1, updatedAt: -1 })
        .limit(6)
        .lean(),
      Student.find({ role: 'student' })
        .select('name studentId majorStream interestAreas careerGoal createdAt')
        .sort({ createdAt: -1 })
        .limit(6)
        .lean(),
      Degree.aggregate([
        { $group: { _id: '$field', total: { $sum: 1 } } },
        { $sort: { total: -1, _id: 1 } },
      ]),
    ])

    res.json({
      counts: {
        totalDegrees,
        activeDegrees,
        inactiveDegrees: totalDegrees - activeDegrees,
        totalStudents,
        totalDegreeEnrollments,
        scholarshipSeekingStudents,
      },
      recentEnrollments,
      recentStudents,
      degreesByField: degreesByField.map((entry) => ({
        field: entry._id || 'Uncategorized',
        total: entry.total,
      })),
    })
})

const deleteStudent = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.params.id)
    if (!student) {
      return res.status(404).json({ message: 'Student not found' })
    }

    await Promise.all([
      Student.findByIdAndDelete(req.params.id),
      Preference.deleteOne({ student: req.params.id }),
      DegreeEnrollment.deleteMany({ student: req.params.id }),
    ])

    await recordAuditEvent(req, {
      action: 'admin.student.deleted',
      entityType: 'Student',
      entityId: req.params.id,
      metadata: {
        deletedStudentEmail: student.email,
        deletedStudentName: student.name,
        deletedStudentRole: student.role,
      },
    })

    res.json({
      message: 'Student and related recommendation data deleted successfully',
    })
})

const getAuditLogs = asyncHandler(async (req, res) => {
    const limit = Math.min(Number(req.query.limit) || 50, 200)
    const page = Math.max(Number(req.query.page) || 1, 1)
    const skip = (page - 1) * limit

    const filter = {}
    if (req.query.entityType) {
      filter.entityType = req.query.entityType
    }
    if (req.query.action) {
      filter.action = req.query.action
    }
    if (req.query.status) {
      filter.status = req.query.status
    }

    const [logs, total] = await Promise.all([
      AuditLog.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      AuditLog.countDocuments(filter),
    ])

    res.json({
      logs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.max(Math.ceil(total / limit), 1),
      },
    })
})

module.exports = {
  getAdminSummary,
  getAllStudents,
  getAllEnrollments: getAllDegreeEnrollments,
  getAllDegreeEnrollments,
  getAuditLogs,
  updateDegreeEnrollmentStatus,
  deleteStudent,
}
