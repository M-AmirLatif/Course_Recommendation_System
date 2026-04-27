const { validateEnv } = require('../config/env')

describe('validateEnv', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = {
      ...originalEnv,
      MONGO_URI: 'mongodb://localhost:27017/testdb',
      JWT_SECRET: '12345678901234567890123456789012',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('returns normalized config for valid env', () => {
    process.env.CORS_ORIGINS = 'https://example.com, http://localhost:5500 '
    process.env.PORT = '8080'

    expect(validateEnv()).toEqual(
      expect.objectContaining({
        nodeEnv: expect.any(String),
        port: 8080,
        corsOrigins: ['https://example.com', 'http://localhost:5500'],
      }),
    )
  })

  test('throws when required env vars are missing', () => {
    delete process.env.MONGO_URI

    expect(() => validateEnv()).toThrow(
      'Missing required environment variables: MONGO_URI',
    )
  })

  test('throws when JWT secret is too short', () => {
    process.env.JWT_SECRET = 'short-secret'

    expect(() => validateEnv()).toThrow(
      'JWT_SECRET must be at least 32 characters long',
    )
  })
})
