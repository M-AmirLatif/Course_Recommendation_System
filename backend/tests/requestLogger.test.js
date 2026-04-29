const request = require('supertest')

describe('request logger middleware', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    process.env = {
      ...originalEnv,
      NODE_ENV: 'test',
      MONGO_URI: 'mongodb://localhost:27017/testdb',
      JWT_SECRET: '12345678901234567890123456789012',
      CORS_ORIGINS: 'http://localhost:5500',
      LOG_LEVEL: 'error',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  test('adds request id header to root responses', async () => {
    const app = require('../app')
    const response = await request(app).get('/')

    expect(response.status).toBe(200)
    expect(response.headers['x-request-id']).toEqual(expect.any(String))
  })
})
