const http = require('http')
const https = require('https')
const logger = require('./logger')

const notifyAlert = (event, payload = {}) => {
  const webhookUrl = String(process.env.ALERT_WEBHOOK_URL || '').trim()

  if (!webhookUrl) {
    return
  }

  try {
    const url = new URL(webhookUrl)
    const transport = url.protocol === 'https:' ? https : http
    const body = JSON.stringify({
      source: 'degree-recommender',
      environment: process.env.NODE_ENV || 'development',
      event,
      timestamp: new Date().toISOString(),
      payload,
    })

    const request = transport.request(
      {
        protocol: url.protocol,
        hostname: url.hostname,
        port: url.port,
        path: `${url.pathname}${url.search}`,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(body),
        },
        timeout: 5000,
      },
      (response) => {
        response.resume()
      },
    )

    request.on('timeout', () => {
      request.destroy(new Error('Alert webhook request timed out'))
    })

    request.on('error', (error) => {
      logger.warn('Failed to send monitoring alert', {
        event,
        error: error.message,
      })
    })

    request.write(body)
    request.end()
  } catch (error) {
    logger.warn('Failed to prepare monitoring alert', {
      event,
      error: error.message,
    })
  }
}

module.exports = {
  notifyAlert,
}
