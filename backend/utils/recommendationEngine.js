// ═══════════════════════════════════════════════════════
//  DEGREE RECOMMENDATION ENGINE
//  Weighted scoring system:
//    Academic Match  → 40%
//    Interests       → 30%
//    Skills          → 15%
//    Career Goals    → 10%
//    Constraints     → 5%
// ═══════════════════════════════════════════════════════

// ── HELPER: Check if arrays share any values ──────────
const hasOverlap = (arr1 = [], arr2 = []) => {
  return arr1.some((a) =>
    arr2.some(
      (b) =>
        a.toLowerCase().includes(b.toLowerCase()) ||
        b.toLowerCase().includes(a.toLowerCase()),
    ),
  )
}

const countOverlap = (arr1 = [], arr2 = []) => {
  return arr1.filter((a) =>
    arr2.some(
      (b) =>
        a.toLowerCase().includes(b.toLowerCase()) ||
        b.toLowerCase().includes(a.toLowerCase()),
    ),
  ).length
}

// ── 1. ACADEMIC MATCH (40 points max) ─────────────────
const scoreAcademic = (student, degree) => {
  let score = 0
  const reasons = []

  // Stream match (15 points)
  if (
    degree.requiredStream.includes('any') ||
    degree.requiredStream.length === 0
  ) {
    score += 10
  } else if (degree.requiredStream.includes(student.majorStream)) {
    score += 15
    reasons.push(`Your ${student.majorStream} stream matches this degree`)
  } else {
    score -= 10 // wrong stream
  }

  // Required subjects match (15 points)
  if (degree.requiredSubjects && degree.requiredSubjects.length > 0) {
    const subjectMatch = countOverlap(
      student.subjectsStudied || [],
      degree.requiredSubjects,
    )
    const matchRatio = subjectMatch / degree.requiredSubjects.length
    const subjectScore = Math.round(matchRatio * 15)
    score += subjectScore
    if (subjectScore >= 10) {
      reasons.push(
        `You have studied ${subjectMatch}/${degree.requiredSubjects.length} required subjects`,
      )
    }
  } else {
    score += 10 // no specific requirements
  }

  // Strong subjects bonus (10 points)
  if (student.strongSubjects && student.strongSubjects.length > 0) {
    const strongMatch = countOverlap(
      student.strongSubjects,
      degree.requiredSubjects || [],
    )
    if (strongMatch > 0) {
      score += Math.min(strongMatch * 5, 10)
      reasons.push(`You are strong in key subjects for this degree`)
    }
  }

  // GPA / grade bonus
  const gpa = student.gpa || student.cgpa || 0
  if (gpa >= 3.5) score += 5
  else if (gpa >= 3.0) score += 3
  else if (gpa >= 2.5) score += 1
  else if (gpa < degree.minGPA) score -= 5

  return { score: Math.max(0, Math.min(score, 40)), reasons }
}

// ── 2. INTEREST MATCH (30 points max) ─────────────────
const scoreInterests = (student, degree) => {
  let score = 0
  const reasons = []

  // Interest area match (20 points)
  const interestMatch = countOverlap(
    student.interestAreas || [],
    degree.idealInterestAreas || [],
  )
  if (interestMatch > 0) {
    const interestScore = Math.min(interestMatch * 7, 20)
    score += interestScore
    const matched = (student.interestAreas || []).filter((a) =>
      (degree.idealInterestAreas || []).some(
        (b) =>
          a.toLowerCase().includes(b.toLowerCase()) ||
          b.toLowerCase().includes(a.toLowerCase()),
      ),
    )
    reasons.push(
      `Your interest in ${matched.join(', ')} aligns with this degree`,
    )
  }

  // Preferred activities match (10 points)
  const activityMatch = countOverlap(
    student.preferredActivities || [],
    degree.idealActivities || [],
  )
  if (activityMatch > 0) {
    score += Math.min(activityMatch * 4, 10)
    reasons.push(`Your preferred activities match this field`)
  }

  return { score: Math.min(score, 30), reasons }
}

// ── 3. SKILLS MATCH (15 points max) ───────────────────
const scoreSkills = (student, degree) => {
  let score = 0
  const reasons = []

  // Analytical skills
  const analyticalMap = { low: 1, medium: 2, high: 3 }
  const degreeAnalytical = analyticalMap[degree.idealAnalytical] || 2
  const studentAnalytical = analyticalMap[student.analyticalSkills] || 2

  if (studentAnalytical >= degreeAnalytical) {
    score += 6
    if (
      student.analyticalSkills === 'high' &&
      degree.idealAnalytical === 'high'
    ) {
      reasons.push(`Your high analytical skills are perfect for this degree`)
    }
  } else if (degreeAnalytical - studentAnalytical === 1) {
    score += 3
  }

  // Creativity level
  const degreeCreativity = analyticalMap[degree.idealCreativity] || 2
  const studentCreativity = analyticalMap[student.creativityLevel] || 2
  if (studentCreativity >= degreeCreativity) {
    score += 5
  } else {
    score += 2
  }

  // Work preference (theory vs practical)
  if (
    degree.workType === 'both' ||
    student.workPreference === 'both' ||
    degree.workType === student.workPreference
  ) {
    score += 4
    if (
      degree.workType === student.workPreference &&
      degree.workType !== 'both'
    ) {
      reasons.push(
        `Matches your preference for ${student.workPreference} learning`,
      )
    }
  }

  return { score: Math.min(score, 15), reasons }
}

// ── 4. CAREER GOALS MATCH (10 points max) ─────────────
const scoreCareerGoals = (student, degree) => {
  let score = 0
  const reasons = []

  if (!student.careerGoal) return { score: 5, reasons }

  // Career outcome match
  const careerMatch = (degree.careerOutcomes || []).some(
    (outcome) =>
      outcome.toLowerCase().includes(student.careerGoal.toLowerCase()) ||
      student.careerGoal.toLowerCase().includes(outcome.toLowerCase()),
  )

  if (careerMatch) {
    score += 10
    reasons.push(`Directly leads to your goal: ${student.careerGoal}`)
  } else {
    // Partial keyword match
    const goalWords = student.careerGoal.toLowerCase().split(' ')
    const partialMatch = (degree.careerOutcomes || []).some((outcome) =>
      goalWords.some(
        (word) => word.length > 3 && outcome.toLowerCase().includes(word),
      ),
    )
    if (partialMatch) {
      score += 5
      reasons.push(`Related to your career goal: ${student.careerGoal}`)
    }
  }

  // Work environment
  if (
    student.workEnvironment === 'any' ||
    degree.field === student.workEnvironment ||
    student.workEnvironment === 'office'
  ) {
    score += 2
  }

  return { score: Math.min(score, 10), reasons }
}

// ── 5. CONSTRAINTS MATCH (5 points max) ───────────────
const scoreConstraints = (student, degree) => {
  let score = 3 // base score — constraints rarely disqualify
  const reasons = []

  // Budget vs university fees
  if (student.budget === 'low') {
    const hasAffordable = (degree.universities || []).some(
      (u) => u.hasScholarship || (u.feePerYear && u.feePerYear.includes('Gov')),
    )
    if (hasAffordable) {
      score += 1
      reasons.push(`Scholarship options available`)
    }
  } else if (student.budget === 'high') {
    score += 2
  } else {
    score += 1
  }

  // Scholarship need
  if (student.needsScholarship) {
    const hasScholarship = (degree.universities || []).some(
      (u) => u.hasScholarship,
    )
    if (hasScholarship) {
      score += 1
      reasons.push(`Universities offer scholarship for this degree`)
    }
  }

  return { score: Math.min(score, 5), reasons }
}

// ── CONFIDENCE LABEL ──────────────────────────────────
const getConfidenceLabel = (percentage) => {
  if (percentage >= 85) return 'Excellent Match'
  if (percentage >= 70) return 'Strong Match'
  if (percentage >= 55) return 'Good Match'
  if (percentage >= 40) return 'Possible Match'
  return 'Weak Match'
}

// ── MAIN RECOMMENDATION FUNCTION ─────────────────────
const recommendDegrees = (student, degrees) => {
  const MAX_SCORE = 100 // 40 + 30 + 15 + 10 + 5

  const scored = degrees
    .filter((degree) => degree.isActive)
    .map((degree) => {
      const academic = scoreAcademic(student, degree)
      const interests = scoreInterests(student, degree)
      const skills = scoreSkills(student, degree)
      const career = scoreCareerGoals(student, degree)
      const constraints = scoreConstraints(student, degree)

      const totalScore =
        academic.score +
        interests.score +
        skills.score +
        career.score +
        constraints.score

      const matchPercentage = Math.round((totalScore / MAX_SCORE) * 100)

      // Collect all reasons
      const allReasons = [
        ...academic.reasons,
        ...interests.reasons,
        ...skills.reasons,
        ...career.reasons,
        ...constraints.reasons,
      ].slice(0, 4) // max 4 reasons shown

      // Build score breakdown
      const breakdown = {
        academic: `${academic.score}/40`,
        interests: `${interests.score}/30`,
        skills: `${skills.score}/15`,
        career: `${career.score}/10`,
        constraints: `${constraints.score}/5`,
      }

      return {
        degree,
        totalScore,
        matchPercentage,
        confidenceLabel: getConfidenceLabel(matchPercentage),
        reasons: allReasons,
        breakdown,
      }
    })

  // Sort by score, return top matches above 20%
  return scored
    .filter((item) => item.matchPercentage >= 20)
    .sort((a, b) => b.totalScore - a.totalScore)
}

module.exports = recommendDegrees
