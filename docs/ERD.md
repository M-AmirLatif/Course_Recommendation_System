# Entity Relationship Diagram (ERD)

## Course Recommender System

## Entities and Relationships

### Student

```
Student {
  _id: ObjectId (PK)
  name: String
  email: String (unique)
  password: String (hashed)
  studentId: String (unique)
  department: String
  semester: Number
  cgpa: Number
  interests: [String]
  careerGoal: String
  skillLevel: String (beginner/intermediate/advanced)
  role: String (student/admin)
}
```

### Course

```
Course {
  _id: ObjectId (PK)
  courseCode: String (unique)
  title: String
  description: String
  department: String
  creditHours: Number
  difficultyLevel: String
  semesterOffered: Number
  prerequisites: [ObjectId] → Course
  tags: [String]
  careerOutcomes: [String]
  skillsGained: [String]
  successRate: Number
  averageRating: Number
  totalEnrollments: Number
  isActive: Boolean
}
```

### Grade

```
Grade {
  _id: ObjectId (PK)
  student: ObjectId (FK → Student)
  course: ObjectId (FK → Course)
  marks: Number
  grade: String (A/B/C/D/F)
  gradePoints: Number
  semester: Number
  academicYear: String
  status: String (passed/failed)
}
```

### Enrollment

```
Enrollment {
  _id: ObjectId (PK)
  student: ObjectId (FK → Student)
  course: ObjectId (FK → Course)
  semester: Number
  academicYear: String
  status: String (enrolled/completed/dropped/failed)
  enrollmentDate: Date
  completionDate: Date
  feedback: {
    rating: Number
    comment: String
    wouldRecommend: Boolean
  }
}
```

### Preference

```
Preference {
  _id: ObjectId (PK)
  student: ObjectId (FK → Student) (unique)
  preferredCareerPaths: [String]
  preferredSubjects: [String]
  preferredSkills: [String]
  preferredDifficulty: String
  likedCourses: [ObjectId] → Course
  dislikedCourses: [ObjectId] → Course
  shortTermGoal: String
  longTermGoal: String
}
```

### CourseOutcome

```
CourseOutcome {
  _id: ObjectId (PK)
  course: ObjectId (FK → Course) (unique)
  learningObjectives: [String]
  industryDemand: String
  relatedJobTitles: [String]
  recommendedNextCourses: [ObjectId] → Course
  toolsAndTechnologies: [String]
}
```

## Relationships Summary

```
Student  →  Grade       : One to Many (1 student, many grades)
Student  →  Enrollment  : One to Many (1 student, many enrollments)
Student  →  Preference  : One to One  (1 student, 1 preference profile)
Course   →  Grade       : One to Many (1 course, many grades)
Course   →  Enrollment  : One to Many (1 course, many enrollments)
Course   →  CourseOutcome: One to One (1 course, 1 outcome profile)
Course   →  Course      : Many to Many (prerequisites)
```
