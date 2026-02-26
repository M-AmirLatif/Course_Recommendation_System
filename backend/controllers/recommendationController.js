const Student = require('../models/Student')
const Course = require('../models/Course')
const Enrollment = require('../models/Enrollment')
const Grade = require('../models/Grade')
const Preference = require('../models/Preference')
const recommendCourses = require('../utils/recommendationEngine')

const getRecommendations = async (req, res) => {
  try {
    const student = await Student.findById(req.student._id)
    const courses = await Course.find({ isActive: true })

    const enrollments = await Enrollment.find({ student: req.student._id })
    const enrolledCourseIds = enrollments.map((e) => e.course.toString())

    const grades = await Grade.find({
      student: req.student._id,
    }).populate('course', 'tags title')

    const preferences = await Preference.findOne({
      student: req.student._id,
    })

    // NEW — get all students and enrollments for collaborative filtering
    const allStudents = await Student.find({ role: 'student' })
    const allEnrollments = await Enrollment.find({ status: 'completed' })

    // Run engine with collaborative filtering
    const recommendations = recommendCourses(
      student,
      courses,
      enrolledCourseIds,
      grades,
      preferences,
      allStudents,
      allEnrollments,
    )

    const top5 = recommendations.slice(0, 5)

    res.json({
      student: student.name,
      careerGoal: student.careerGoal,
      interests: student.interests,
      cgpa: student.cgpa,
      totalCoursesAnalyzed: courses.length,
      recommendations: top5.map((item, index) => ({
        rank: index + 1,
        courseCode: item.course.courseCode,
        title: item.course.title,
        difficulty: item.course.difficultyLevel,
        successRate: item.course.successRate,
        rating: item.course.averageRating,
        score: item.score,
        whyRecommended: item.reasons,
      })),
    })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

module.exports = { getRecommendations }
