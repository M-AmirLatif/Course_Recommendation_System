const mongoose = require('mongoose')
const logger = require('../utils/logger')
const { notifyAlert } = require('../utils/monitoring')

let connectionPromise

const connectDB = async () => {
  const uri = process.env.MONGO_URI

  if (!uri) {
    throw new Error('No MongoDB URI found. Set MONGO_URI in environment variables.')
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((conn) => {
        logger.info('MongoDB connected', {
          host: conn.connection.host,
        })
        return conn.connection
      })
      .catch((error) => {
        connectionPromise = null
        notifyAlert('backend.database_connection_failed', {
          error: error.message,
        })
        throw error
      })
  }

  return connectionPromise
}

module.exports = connectDB
