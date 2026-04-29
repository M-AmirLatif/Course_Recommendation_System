jest.mock('jsonwebtoken', () => ({
  verify: jest.fn(),
}))

jest.mock('../models/Student', () => ({
  findById: jest.fn(),
}))

const jwt = require('jsonwebtoken')
const Student = require('../models/Student')
const protect = require('../middleware/authMiddleware')

const createResponse = () => {
  const res = {}
  res.status = jest.fn().mockReturnValue(res)
  res.json = jest.fn().mockReturnValue(res)
  return res
}

describe('auth middleware', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.JWT_SECRET = '12345678901234567890123456789012'
  })

  test('rejects missing token', async () => {
    const req = { headers: {} }
    const res = createResponse()
    const next = jest.fn()

    await protect(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Not authorized, no token',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('rejects invalid token', async () => {
    const req = {
      headers: { authorization: 'Bearer bad-token' },
    }
    const res = createResponse()
    const next = jest.fn()

    jwt.verify.mockImplementation(() => {
      throw new Error('bad token')
    })

    await protect(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Not authorized, token failed',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('rejects token for deleted user', async () => {
    const req = {
      headers: { authorization: 'Bearer valid-token' },
    }
    const res = createResponse()
    const next = jest.fn()

    jwt.verify.mockReturnValue({ id: 'student-id' })
    Student.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    })

    await protect(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Not authorized, user not found',
    })
    expect(next).not.toHaveBeenCalled()
  })

  test('attaches student and continues on success', async () => {
    const req = {
      headers: { authorization: 'Bearer valid-token' },
    }
    const res = createResponse()
    const next = jest.fn()
    const student = { _id: 'student-id', role: 'student' }

    jwt.verify.mockReturnValue({ id: 'student-id' })
    Student.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(student),
    })

    await protect(req, res, next)

    expect(req.student).toEqual(student)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
  })

  test('accepts token from auth cookie', async () => {
    const req = {
      headers: { cookie: 'drs_token=valid-cookie-token' },
    }
    const res = createResponse()
    const next = jest.fn()
    const student = { _id: 'student-id', role: 'student' }

    jwt.verify.mockReturnValue({ id: 'student-id' })
    Student.findById.mockReturnValue({
      select: jest.fn().mockResolvedValue(student),
    })

    await protect(req, res, next)

    expect(req.student).toEqual(student)
    expect(next).toHaveBeenCalledTimes(1)
    expect(res.status).not.toHaveBeenCalled()
  })
})
