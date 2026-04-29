const LEVELS = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
}

const getConfiguredLevel = () => {
  const configured = String(process.env.LOG_LEVEL || 'info').toLowerCase()
  return Object.prototype.hasOwnProperty.call(LEVELS, configured)
    ? configured
    : 'info'
}

const shouldLog = (level) => LEVELS[level] <= LEVELS[getConfiguredLevel()]

const write = (level, message, meta = {}) => {
  if (!shouldLog(level)) return

  const payload = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  }

  const line = JSON.stringify(payload)
  if (level === 'error') {
    process.stderr.write(`${line}\n`)
    return
  }

  process.stdout.write(`${line}\n`)
}

module.exports = {
  info(message, meta) {
    write('info', message, meta)
  },
  warn(message, meta) {
    write('warn', message, meta)
  },
  error(message, meta) {
    write('error', message, meta)
  },
  debug(message, meta) {
    write('debug', message, meta)
  },
}
