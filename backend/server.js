const dotenv = require('dotenv')

dotenv.config()

const connectDB = require('./config/db')
const { validateEnv } = require('./config/env')
const app = require('./app')

const startServer = async () => {
  try {
    const config = validateEnv()
    await connectDB()
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`)
    })
  } catch (error) {
    console.error(`Startup error: ${error.message}`)
    process.exit(1)
  }
}

startServer()
