import assert from 'node:assert/strict'

const apiBaseUrl = String(process.env.E2E_API_URL || '')
  .trim()
  .replace(/\/+$/, '')

export const run = async () => {
  if (!apiBaseUrl) {
    console.log('SKIP auth-flow.test.mjs (set E2E_API_URL to run it)')
    return
  }

  const uniqueId = Date.now().toString()
  const payload = {
    name: `E2E Student ${uniqueId}`,
    studentId: `E2E-${uniqueId}`,
    email: `e2e-${uniqueId}@example.com`,
    password: '1234567890StrongPassword',
    educationLevel: 'intermediate',
    previousQualification: 'ICS (Computer Science)',
    majorStream: 'technology',
    subjectsStudied: ['Computer', 'Mathematics'],
    strongSubjects: ['Computer'],
    gpa: 3.2,
    cgpa: 3.2,
    interestAreas: ['Technology'],
    preferredActivities: ['Problem Solving'],
    analyticalSkills: 'high',
    communicationSkills: 'medium',
    creativityLevel: 'medium',
    workPreference: 'both',
    teamPreference: 'both',
    careerGoal: 'Software Engineer',
    workEnvironment: 'office',
    budget: 'medium',
    studyLocation: 'local',
    needsScholarship: false,
    department: 'General',
    semester: 1,
    skillLevel: 'beginner',
    interests: ['Technology'],
  }

  const registerResponse = await fetch(`${apiBaseUrl}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  assert.equal(registerResponse.status, 201)
  const setCookieHeader = registerResponse.headers.get('set-cookie') || ''
  assert.match(setCookieHeader, /drs_token=/)

  const registerBody = await registerResponse.json()
  assert.equal(registerBody.email, payload.email)

  const profileResponse = await fetch(`${apiBaseUrl}/api/auth/profile`, {
    headers: {
      Cookie: setCookieHeader.split(';')[0],
    },
  })

  assert.equal(profileResponse.status, 200)
  const profileBody = await profileResponse.json()
  assert.equal(profileBody.email, payload.email)
}
