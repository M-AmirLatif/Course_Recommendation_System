const AUTH_COOKIE_NAME = 'drs_token'

const durationUnits = {
  s: 1000,
  m: 60 * 1000,
  h: 60 * 60 * 1000,
  d: 24 * 60 * 60 * 1000,
}

const parseExpiryToMs = (value) => {
  const normalized = String(value || '').trim().toLowerCase()
  const match = normalized.match(/^(\d+)([smhd])$/)

  if (!match) {
    return 7 * 24 * 60 * 60 * 1000
  }

  return Number(match[1]) * durationUnits[match[2]]
}

const isProduction = () => process.env.NODE_ENV === 'production'

const getCookieOptions = () => {
  const secure = isProduction()

  return {
    httpOnly: true,
    secure,
    sameSite: secure ? 'none' : 'lax',
    maxAge: parseExpiryToMs(process.env.JWT_EXPIRES_IN || '7d'),
    path: '/',
  }
}

const setAuthCookie = (res, token) => {
  res.cookie(AUTH_COOKIE_NAME, token, getCookieOptions())
}

const clearAuthCookie = (res) => {
  res.clearCookie(AUTH_COOKIE_NAME, {
    ...getCookieOptions(),
    maxAge: undefined,
  })
}

const parseCookies = (cookieHeader) => {
  if (!cookieHeader) {
    return {}
  }

  return String(cookieHeader)
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .reduce((cookies, entry) => {
      const separatorIndex = entry.indexOf('=')
      if (separatorIndex === -1) {
        return cookies
      }

      const name = entry.slice(0, separatorIndex).trim()
      const value = entry.slice(separatorIndex + 1).trim()
      cookies[name] = decodeURIComponent(value)
      return cookies
    }, {})
}

const getTokenFromRequest = (req) => {
  const cookies = parseCookies(req.headers.cookie)

  if (cookies[AUTH_COOKIE_NAME]) {
    return cookies[AUTH_COOKIE_NAME]
  }

  const authorization = req.headers.authorization || ''
  if (authorization.startsWith('Bearer ')) {
    return authorization.split(' ')[1]
  }

  return null
}

module.exports = {
  AUTH_COOKIE_NAME,
  clearAuthCookie,
  getCookieOptions,
  getTokenFromRequest,
  setAuthCookie,
}
