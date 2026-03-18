const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const connectDB = require('./config/db')

dotenv.config()

// Connect to MongoDB
connectDB()

const app = express()

// Middleware
app.use(
  cors({
    origin: [
      'https://m-amirlatif.github.io',
      'http://localhost:5500',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
    ],
    credentials: true,
  }),
)

app.use('/api/degrees', require('./routes/degreeRoutes'))

app.use(express.json())

// Routes (we will add these one by one)
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/courses', require('./routes/courseRoutes'))
app.use('/api/recommendations', require('./routes/recommendationRoutes'))
app.use('/api/enrollments', require('./routes/enrollmentRoutes'))
app.use('/api/grades', require('./routes/gradeRoutes'))
app.use('/api/preferences', require('./routes/preferenceRoutes'))
app.use('/api/admin', require('./routes/adminRoutes'))

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Course Recommender API is running!' })
})

// Handle unknown routes
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` })
})

// Global error handler
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
