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


const isDev = process.env.NODE_ENV !== 'production'

const allowedOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',').map((origin) => origin.trim()).filter(Boolean)
  : []

const isLocalOrigin = (origin) =>
  /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)

// ── Middleware (ORDER MATTERS) ─────────────────
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true)
      if (isDev && isLocalOrigin(origin)) return callback(null, true)
      if (!allowedOrigins.length) return callback(null, false)
      if (allowedOrigins.includes(origin)) return callback(null, true)
      callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
  }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Routes ─────────────────────────────────────
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/courses', require('./routes/courseRoutes'))
app.use('/api/recommendations', require('./routes/recommendationRoutes'))
app.use('/api/preferences', require('./routes/preferenceRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))
app.use('/api/degrees', require('./routes/degreeRoutes'))
app.use('/api/degree-enrollments', require('./routes/degreeEnrollmentRoutes'))

// ── Health check ───────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'Degree Recommender API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
})

// ── 404 Handler ────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

// ── Global Error Handler ───────────────────────
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    message: err.message || 'Something went wrong on the server',
  })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
*/
