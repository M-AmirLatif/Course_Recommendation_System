const parseNumber = (value, fallback) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET']

const validateEnv = () => {
  const missing = requiredEnvVars.filter(
    (key) => !String(process.env[key] || '').trim(),
  )

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    )
  }

  if (String(process.env.JWT_SECRET).trim().length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long')
  }

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseNumber(process.env.PORT, 5000),
    corsOrigins: String(process.env.CORS_ORIGINS || '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
    apiRateLimitMax: parseNumber(process.env.API_RATE_LIMIT_MAX, 300),
    authRateLimitMax: parseNumber(process.env.AUTH_RATE_LIMIT_MAX, 20),
  }
}

module.exports = {
  validateEnv,
}
