const recommendDegrees = require('../utils/recommendationEngine')

describe('recommendDegrees', () => {
  const student = {
    majorStream: 'science',
    subjectsStudied: ['Mathematics', 'Physics', 'Computer'],
    strongSubjects: ['Mathematics', 'Computer'],
    gpa: 3.7,
    interestAreas: ['Technology', 'Artificial Intelligence'],
    preferredActivities: ['Problem Solving', 'Research'],
    analyticalSkills: 'high',
    creativityLevel: 'medium',
    workPreference: 'both',
    workEnvironment: 'office',
    careerGoal: 'Software Engineer',
    budget: 'medium',
    needsScholarship: true,
    studyLocation: 'local',
  }

  const matchingDegree = {
    _id: 'degree-1',
    isActive: true,
    name: 'BS Computer Science',
    field: 'Technology',
    requiredSubjects: ['Mathematics', 'Computer'],
    requiredStream: ['science', 'technology'],
    minGPA: 2.5,
    idealInterestAreas: ['Technology', 'AI'],
    idealActivities: ['Problem Solving', 'Research'],
    idealAnalytical: 'high',
    idealCreativity: 'medium',
    workType: 'both',
    careerOutcomes: ['Software Engineer', 'Data Scientist'],
    universities: [{ location: 'Lahore', hasScholarship: true }],
  }

  const hiddenDegree = {
    _id: 'degree-2',
    isActive: true,
    name: 'Unwanted Degree',
    field: 'Arts',
    requiredSubjects: [],
    requiredStream: ['any'],
    minGPA: 2,
    idealInterestAreas: ['Design'],
    idealActivities: ['Creativity'],
    idealAnalytical: 'low',
    idealCreativity: 'high',
    workType: 'practical',
    careerOutcomes: ['Designer'],
    universities: [{ location: 'Online', hasScholarship: false }],
  }

  test('prioritizes strong matches and excludes disliked degrees', () => {
    const results = recommendDegrees(student, [matchingDegree, hiddenDegree], {
      currentPreference: {
        likedDegrees: [],
        dislikedDegrees: ['degree-2'],
      },
      communityPreferences: [],
      student,
    })

    expect(results).toHaveLength(1)
    expect(results[0].degree.name).toBe('BS Computer Science')
    expect(results[0].matchPercentage).toBeGreaterThanOrEqual(20)
    expect(results[0].reasons.length).toBeGreaterThan(0)
    expect(results[0].breakdown.feedback).toMatch(/^[+-]?\d+(\.\d)?\/20$/)
  })
})
