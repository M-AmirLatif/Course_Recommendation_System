const dotenv = require('dotenv')

dotenv.config()

const connectDB = require('./config/db')
const { validateEnv } = require('./config/env')
const app = require('./app')
const logger = require('./utils/logger')
const { notifyAlert } = require('./utils/monitoring')

const startServer = async () => {
  try {
    const config = validateEnv()
    await connectDB()
    app.listen(config.port, () => {
      logger.info('Server started', {
        port: config.port,
        environment: config.nodeEnv,
      })
    })
  } catch (error) {
    logger.error('Startup error', {
      error: error.message,
      stack: error.stack,
    })
    notifyAlert('backend.startup_failed', {
      error: error.message,
      stack: error.stack,
    })
    process.exit(1)
  }
}

startServer()
