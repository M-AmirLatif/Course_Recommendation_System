// Run this after seeding degrees to attach major/core courses to each degree.
// node backend/seedCourses.js

const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()

const Degree = require('./models/Degree')
const Course = require('./models/Course')
const logger = require('./utils/logger')

const makeCourse = (
  courseCode,
  title,
  department,
  semesterOffered,
  difficultyLevel,
  tags = [],
  skillsGained = [],
) => ({
  courseCode,
  title,
  description: `${title} core course.`,
  department,
  creditHours: 3,
  difficultyLevel,
  semesterOffered,
  tags,
  skillsGained,
  careerOutcomes: [],
  successRate: 80,
  averageRating: 4.2,
  isCore: true,
  category: 'core',
  relevantSubjects: tags,
  skillTags: skillsGained,
  careerTags: [],
  isActive: true,
})

const COURSE_CATALOG = {
  BSCS: [
    makeCourse(
      'CS101',
      'Programming Fundamentals',
      'Computer Science',
      1,
      'beginner',
      ['Programming', 'C++', 'Logic'],
      ['Programming Basics', 'Problem Solving'],
    ),
    makeCourse(
      'CS201',
      'Data Structures & Algorithms',
      'Computer Science',
      3,
      'intermediate',
      ['Algorithms', 'DSA'],
      ['Algorithm Design', 'Complexity Analysis'],
    ),
    makeCourse(
      'CS301',
      'Operating Systems',
      'Computer Science',
      5,
      'intermediate',
      ['OS', 'Systems'],
      ['Process Management', 'Concurrency'],
    ),
    makeCourse(
      'CS302',
      'Database Systems',
      'Computer Science',
      4,
      'intermediate',
      ['Databases', 'SQL'],
      ['Schema Design', 'Querying'],
    ),
    makeCourse(
      'CS303',
      'Computer Networks',
      'Computer Science',
      5,
      'intermediate',
      ['Networks', 'Protocols'],
      ['Networking Fundamentals'],
    ),
    makeCourse(
      'CS401',
      'Software Engineering',
      'Computer Science',
      6,
      'intermediate',
      ['SDLC', 'Design'],
      ['System Design', 'Team Collaboration'],
    ),
  ],
  BSAI: [
    makeCourse(
      'AI101',
      'Introduction to Artificial Intelligence',
      'Artificial Intelligence',
      2,
      'beginner',
      ['AI', 'Foundations'],
      ['Search', 'Reasoning'],
    ),
    makeCourse(
      'AI201',
      'Machine Learning',
      'Artificial Intelligence',
      4,
      'intermediate',
      ['ML', 'Models'],
      ['Model Training', 'Evaluation'],
    ),
    makeCourse(
      'AI301',
      'Deep Learning',
      'Artificial Intelligence',
      6,
      'advanced',
      ['DL', 'Neural Networks'],
      ['Neural Networks', 'Optimization'],
    ),
    makeCourse(
      'AI302',
      'Natural Language Processing',
      'Artificial Intelligence',
      6,
      'advanced',
      ['NLP', 'Text'],
      ['Text Processing', 'Language Models'],
    ),
    makeCourse(
      'AI303',
      'Computer Vision',
      'Artificial Intelligence',
      7,
      'advanced',
      ['Vision', 'Image Processing'],
      ['Feature Extraction', 'Image Models'],
    ),
  ],
  BSSE: [
    makeCourse(
      'SE101',
      'Software Process & Models',
      'Software Engineering',
      2,
      'beginner',
      ['Process', 'SDLC'],
      ['Process Thinking', 'Documentation'],
    ),
    makeCourse(
      'SE201',
      'Requirements Engineering',
      'Software Engineering',
      3,
      'intermediate',
      ['Requirements'],
      ['Elicitation', 'Specification'],
    ),
    makeCourse(
      'SE301',
      'Software Design & Architecture',
      'Software Engineering',
      5,
      'intermediate',
      ['Design', 'Architecture'],
      ['Design Patterns', 'Architecture'],
    ),
    makeCourse(
      'SE302',
      'Software Testing & QA',
      'Software Engineering',
      6,
      'intermediate',
      ['Testing', 'QA'],
      ['Test Planning', 'Automation Basics'],
    ),
    makeCourse(
      'SE401',
      'Software Project Management',
      'Software Engineering',
      7,
      'advanced',
      ['Management', 'Agile'],
      ['Planning', 'Delivery'],
    ),
  ],
  MBBS: [
    makeCourse(
      'MED101',
      'Human Anatomy',
      'Medicine',
      1,
      'beginner',
      ['Anatomy', 'Human Body'],
      ['Anatomy Basics'],
    ),
    makeCourse(
      'MED102',
      'Physiology',
      'Medicine',
      2,
      'beginner',
      ['Physiology'],
      ['Body Systems'],
    ),
    makeCourse(
      'MED201',
      'Biochemistry',
      'Medicine',
      3,
      'intermediate',
      ['Biochemistry'],
      ['Metabolism', 'Molecular Biology'],
    ),
    makeCourse(
      'MED301',
      'Pathology',
      'Medicine',
      5,
      'intermediate',
      ['Pathology'],
      ['Disease Mechanisms'],
    ),
    makeCourse(
      'MED302',
      'Pharmacology',
      'Medicine',
      5,
      'intermediate',
      ['Pharmacology'],
      ['Drug Mechanisms'],
    ),
  ],
  BBA: [
    makeCourse(
      'BBA101',
      'Principles of Management',
      'Business Administration',
      1,
      'beginner',
      ['Management'],
      ['Leadership', 'Organization'],
    ),
    makeCourse(
      'BBA102',
      'Principles of Marketing',
      'Business Administration',
      2,
      'beginner',
      ['Marketing'],
      ['Market Research', 'Positioning'],
    ),
    makeCourse(
      'BBA201',
      'Financial Accounting',
      'Business Administration',
      3,
      'intermediate',
      ['Accounting'],
      ['Financial Statements'],
    ),
    makeCourse(
      'BBA202',
      'Corporate Finance',
      'Business Administration',
      4,
      'intermediate',
      ['Finance'],
      ['Capital Budgeting'],
    ),
    makeCourse(
      'BBA301',
      'Business Law',
      'Business Administration',
      5,
      'intermediate',
      ['Law'],
      ['Compliance Basics'],
    ),
  ],
}

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    logger.info('Seed courses connected to MongoDB')

    const degreeShortNames = Object.keys(COURSE_CATALOG)
    const degrees = await Degree.find({ shortName: { $in: degreeShortNames } })
    const degreeByShort = new Map(
      degrees.map((degree) => [degree.shortName, degree]),
    )

    let upserted = 0
    let skipped = 0

    for (const shortName of degreeShortNames) {
      const degree = degreeByShort.get(shortName)
      if (!degree) {
        logger.warn('Degree not found while seeding courses', { shortName })
        skipped += COURSE_CATALOG[shortName].length
        continue
      }

      for (const course of COURSE_CATALOG[shortName]) {
        const payload = { ...course, degree: degree._id }
        await Course.updateOne(
          { courseCode: payload.courseCode },
          { $set: payload },
          { upsert: true },
        )
        upserted += 1
      }
    }

    logger.info('Seeded courses', { upserted, skipped })
  } catch (error) {
    logger.error('Seed courses failed', {
      error: error.message,
      stack: error.stack,
    })
    process.exit(1)
  } finally {
    await mongoose.connection.close()
  }
}

seedCourses()


