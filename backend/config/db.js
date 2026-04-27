const mongoose = require('mongoose')

let connectionPromise

const connectDB = async () => {
  const uri = process.env.MONGO_URI

  if (!uri) {
    throw new Error('No MongoDB URI found. Set MONGO_URI in environment variables.')
  }

  if (mongoose.connection.readyState === 1) {
    return mongoose.connection
  }

  /*
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    process.exit(1)
  */

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(uri, {
        serverSelectionTimeoutMS: 10000,
      })
      .then((conn) => {
        console.log(`MongoDB connected: ${conn.connection.host}`)
        return conn.connection
      })
      .catch((error) => {
        connectionPromise = null
        throw error
      })
  }

  return connectionPromise
}

module.exports = connectDB
