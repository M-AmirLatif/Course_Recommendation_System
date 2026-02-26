// ─────────────────────────────────────────
// COLLABORATIVE FILTERING HELPER
// Finds similar students based on interests
// and career goals
// ─────────────────────────────────────────
const findSimilarStudents = (currentStudent, allStudents) => {
  const similarStudents = allStudents
    .filter((s) => s._id.toString() !== currentStudent._id.toString())
    .map((student) => {
      let similarityScore = 0

      // Compare interests
      const commonInterests = currentStudent.interests.filter((interest) =>
        student.interests.some(
          (si) => si.toLowerCase() === interest.toLowerCase(),
        ),
      )
      similarityScore += commonInterests.length * 20

      // Compare career goals
      if (student.careerGoal && currentStudent.careerGoal) {
        if (
          student.careerGoal.toLowerCase() ===
          currentStudent.careerGoal.toLowerCase()
        ) {
          similarityScore += 30
        }
      }

      // Compare skill level
      if (student.skillLevel === currentStudent.skillLevel) {
        similarityScore += 10
      }

      // Compare department
      if (student.department === currentStudent.department) {
        similarityScore += 15
      }

      return { student, similarityScore }
    })
    .filter((item) => item.similarityScore > 0)
    .sort((a, b) => b.similarityScore - a.similarityScore)
    .slice(0, 5) // top 5 similar students

  return similarStudents
}

// ─────────────────────────────────────────
// PREDICTIVE MODELING
// Estimates success probability for a course
// based on student's historical performance
// ─────────────────────────────────────────
const predictSuccessProbability = (student, course, grades) => {
  let probability = 50 // base 50%

  // Factor 1: CGPA impact
  if (student.cgpa >= 3.5) probability += 20
  else if (student.cgpa >= 3.0) probability += 15
  else if (student.cgpa >= 2.5) probability += 10
  else if (student.cgpa >= 2.0) probability += 5
  else probability -= 10

  // Factor 2: Skill level vs difficulty match
  if (course.difficultyLevel === student.skillLevel) {
    probability += 15
  } else if (
    (student.skillLevel === 'advanced' &&
      course.difficultyLevel === 'intermediate') ||
    (student.skillLevel === 'intermediate' &&
      course.difficultyLevel === 'beginner')
  ) {
    probability += 20 // easier than skill level = high chance
  } else if (
    student.skillLevel === 'beginner' &&
    course.difficultyLevel === 'advanced'
  ) {
    probability -= 20 // too hard
  }

  // Factor 3: Past performance in similar courses
  if (grades && grades.length > 0) {
    const similarGrades = grades.filter((g) => {
      const courseTags = g.course.tags || []
      return courseTags.some((tag) => course.tags.includes(tag))
    })

    if (similarGrades.length > 0) {
      const avgGradePoints =
        similarGrades.reduce((sum, g) => sum + g.gradePoints, 0) /
        similarGrades.length

      if (avgGradePoints >= 3.5) probability += 15
      else if (avgGradePoints >= 3.0) probability += 10
      else if (avgGradePoints >= 2.0) probability += 5
      else probability -= 10
    }
  }

  // Factor 4: Course success rate
  if (course.successRate >= 85) probability += 10
  else if (course.successRate >= 70) probability += 5
  else probability -= 5

  // Clamp between 10% and 99%
  return Math.min(99, Math.max(10, Math.round(probability)))
}

const recommendCourses = (
  student,
  courses,
  enrolledCourseIds,
  grades,
  preferences,
  allStudents, // NEW
  allEnrollments, // NEW
) => {
  const scoredCourses = courses.map((course) => {
    let score = 0
    let reasons = []

    // ── 1. INTEREST MATCHING ──────────────────
    const interestMatches = student.interests.filter((interest) =>
      course.tags.some(
        (tag) =>
          tag.toLowerCase().includes(interest.toLowerCase()) ||
          interest.toLowerCase().includes(tag.toLowerCase()),
      ),
    )
    if (interestMatches.length > 0) {
      score += interestMatches.length * 20
      reasons.push(`Matches your interests: ${interestMatches.join(', ')}`)
    }

    // ── 2. CAREER GOAL MATCHING ───────────────
    const careerMatches = course.careerOutcomes.filter(
      (outcome) =>
        outcome.toLowerCase().includes(student.careerGoal.toLowerCase()) ||
        student.careerGoal.toLowerCase().includes(outcome.toLowerCase()),
    )
    if (careerMatches.length > 0) {
      score += careerMatches.length * 25
      reasons.push(`Aligns with your career goal: ${student.careerGoal}`)
    }

    // ── 3. SKILL LEVEL MATCHING ───────────────
    if (course.difficultyLevel === student.skillLevel) {
      score += 15
      reasons.push(`Matches your skill level: ${student.skillLevel}`)
    } else if (
      (student.skillLevel === 'intermediate' &&
        course.difficultyLevel === 'beginner') ||
      (student.skillLevel === 'advanced' &&
        course.difficultyLevel === 'intermediate')
    ) {
      score += 5
      reasons.push('Slightly below your level — good for revision')
    }

    // ── 4. GRADE BASED BOOST ──────────────────
    // If student got A or B in similar courses → boost related courses
    if (grades && grades.length > 0) {
      grades.forEach((grade) => {
        if (grade.status === 'passed' && grade.gradePoints >= 3.0) {
          // Check if passed course tags match current course tags
          const passedCourseTags = grade.course.tags || []
          const tagOverlap = passedCourseTags.filter((tag) =>
            course.tags.includes(tag),
          )
          if (tagOverlap.length > 0) {
            score += tagOverlap.length * 10
            reasons.push(`You performed well in similar courses`)
          }
        }
        // If student failed a similar course → reduce score
        if (grade.status === 'failed') {
          const passedCourseTags = grade.course.tags || []
          const tagOverlap = passedCourseTags.filter((tag) =>
            course.tags.includes(tag),
          )
          if (tagOverlap.length > 0) {
            score -= tagOverlap.length * 5
            reasons.push(`You may need more preparation for this area`)
          }
        }
      })
    }

    // ── 5. PREFERENCE MATCHING ────────────────
    if (preferences) {
      // Match preferred skills with course skills
      const skillMatches = preferences.preferredSkills.filter((skill) =>
        course.skillsGained.some(
          (s) =>
            s.toLowerCase().includes(skill.toLowerCase()) ||
            skill.toLowerCase().includes(s.toLowerCase()),
        ),
      )
      if (skillMatches.length > 0) {
        score += skillMatches.length * 15
        reasons.push(
          `Teaches your preferred skills: ${skillMatches.join(', ')}`,
        )
      }

      // Match preferred career paths
      const careerPathMatches = preferences.preferredCareerPaths.filter(
        (path) =>
          course.careerOutcomes.some(
            (outcome) =>
              outcome.toLowerCase().includes(path.toLowerCase()) ||
              path.toLowerCase().includes(outcome.toLowerCase()),
          ),
      )
      if (careerPathMatches.length > 0) {
        score += careerPathMatches.length * 20
        reasons.push(
          `Matches your career path: ${careerPathMatches.join(', ')}`,
        )
      }

      // Liked courses boost — if student liked similar course
      if (preferences.likedCourses && preferences.likedCourses.length > 0) {
        const isLiked = preferences.likedCourses.some(
          (likedId) => likedId.toString() === course._id.toString(),
        )
        if (isLiked) {
          score += 30
          reasons.push('You marked this course as interesting')
        }
      }

      // Disliked courses penalty
      if (
        preferences.dislikedCourses &&
        preferences.dislikedCourses.length > 0
      ) {
        const isDisliked = preferences.dislikedCourses.some(
          (dislikedId) => dislikedId.toString() === course._id.toString(),
        )
        if (isDisliked) {
          score = -1
        }
      }
    }

    // ── 6. SUCCESS RATE BONUS ─────────────────
    if (course.successRate >= 85) {
      score += 10
      reasons.push(`High success rate: ${course.successRate}%`)
    } else if (course.successRate >= 75) {
      score += 5
    }

    // ── 7. RATING BONUS ───────────────────────
    if (course.averageRating >= 4.5) {
      score += 10
      reasons.push(`Highly rated: ${course.averageRating}/5`)
    } else if (course.averageRating >= 4.0) {
      score += 5
    }

    // ── 8. COLLABORATIVE FILTERING ───────────
    if (allStudents && allStudents.length > 0 && allEnrollments) {
      // Find similar students
      const similarStudents = findSimilarStudents(student, allStudents)

      similarStudents.forEach(({ student: simStudent, similarityScore }) => {
        // Find courses this similar student enrolled in
        const simEnrollments = allEnrollments.filter(
          (e) =>
            e.student.toString() === simStudent._id.toString() &&
            e.status === 'completed',
        )

        simEnrollments.forEach((enrollment) => {
          if (enrollment.course.toString() === course._id.toString()) {
            // Similar student completed this course!
            const boost = Math.round(similarityScore * 0.3)
            score += boost
            reasons.push(
              `Similar students with your profile completed this course`,
            )
          }
        })
      })
    }
    // ─────────────────────────────────────────

    // ── 9. ALREADY ENROLLED PENALTY ──────────
    const alreadyEnrolled = enrolledCourseIds.includes(course._id.toString())
    if (alreadyEnrolled) {
      score = -1
    }

    const successProbability = predictSuccessProbability(
      student,
      course,
      grades,
    )
    return { course, score, reasons, successProbability }
  })

  // Filter and sort
  const recommendations = scoredCourses
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)

  return recommendations
}

module.exports = recommendCourses
