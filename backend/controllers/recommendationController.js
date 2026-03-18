const Student = require('../models/Student')
const Degree = require('../models/Degree')
const recommendDegrees = require('../utils/recommendationEngine')

const getRecommendations = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id)
    if (!student) return res.status(404).json({ message: 'Student not found' })

    // Get all active degrees
    const degrees = await Degree.find({ isActive: true })

    if (degrees.length === 0) {
      return res.json({
        student: student.name,
        careerGoal: student.careerGoal,
        interestAreas: student.interestAreas || [],
        totalDegreesAnalyzed: 0,
        recommendations: [],
        message: 'No degrees in database yet. Admin needs to add degrees.',
      })
    }

    // Run recommendation engine
    const recommendations = recommendDegrees(student, degrees)

    res.json({
      student: student.name,
      careerGoal: student.careerGoal || 'Not specified',
      interestAreas: student.interestAreas || [],
      majorStream: student.majorStream,
      totalDegreesAnalyzed: degrees.length,
      recommendations: recommendations.slice(0, 8).map((rec, index) => ({
        rank: index + 1,
        degreeId: rec.degree._id,
        name: rec.degree.name,
        shortName: rec.degree.shortName,
        field: rec.degree.field,
        duration: rec.degree.duration,
        description: rec.degree.description,
        matchPercentage: rec.matchPercentage,
        confidenceLabel: rec.confidenceLabel,
        whyRecommended: rec.reasons,
        breakdown: rec.breakdown,
        universities: rec.degree.universities || [],
        careerOutcomes: rec.degree.careerOutcomes || [],
        expectedSalary: rec.degree.expectedSalary,
        jobMarket: rec.degree.jobMarket,
        successRate: rec.degree.successRate,
      })),
    })
  } catch (error) {
    console.error('Recommendation error:', error)
    res.status(500).json({ message: 'Error generating recommendations' })
  }
}

module.exports = { getRecommendations }
