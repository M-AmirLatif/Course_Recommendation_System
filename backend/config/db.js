const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    // Support both variable names for flexibility
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI

    if (!uri) {
      throw new Error(
        'No MongoDB URI found. Set MONGODB_URI or MONGO_URI in environment variables.',
      )
    }

    const conn = await mongoose.connect(uri)
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`)
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`)
    process.exit(1)
  }
}

module.exports = connectDB
