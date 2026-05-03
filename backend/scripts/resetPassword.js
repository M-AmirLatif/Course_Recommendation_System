const dotenv = require('dotenv')
const bcrypt = require('bcryptjs')

dotenv.config()

const connectDB = require('../config/db')
const Student = require('../models/Student')

const [identifier, newPassword] = process.argv.slice(2)

const printUsageAndExit = (message) => {
  if (message) {
    console.error(message)
  }

  console.log(
    'Usage: npm run reset:password -- <email-or-studentId> <newPassword>',
  )
  process.exit(1)
}

if (!identifier || !newPassword) {
  printUsageAndExit()
}

if (newPassword.length < 8) {
  printUsageAndExit('Password must be at least 8 characters long.')
}

if (!/^(?=.*[A-Za-z])(?=.*\d).+$/.test(newPassword)) {
  printUsageAndExit(
    'Password must contain at least one letter and one number.',
  )
}

const normalizedIdentifier = String(identifier).trim()
const normalizedEmail = normalizedIdentifier.toLowerCase()

const resetPassword = async () => {
  try {
    await connectDB()

    const student = await Student.findOne({
      $or: [{ email: normalizedEmail }, { studentId: normalizedIdentifier }],
    })

    if (!student) {
      console.error('User not found.')
      process.exitCode = 1
      return
    }

    const salt = await bcrypt.genSalt(10)
    student.password = await bcrypt.hash(newPassword, salt)
    await student.save()

    console.log(`Password updated for ${student.email} (${student.studentId}).`)
  } catch (error) {
    console.error(`Failed to reset password: ${error.message}`)
    process.exitCode = 1
  } finally {
    await require('mongoose').connection.close()
  }
}

resetPassword()
