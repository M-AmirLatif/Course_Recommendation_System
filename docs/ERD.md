# Entity Relationship Diagram (ERD)

## Degree Recommendation System

## Entities and Relationships

### Student

```text
Student {
  _id: ObjectId (PK)
  name: String
  email: String (unique)
  password: String (hashed)
  studentId: String (unique)
  role: String (student/admin)
  educationLevel: String
  previousQualification: String
  majorStream: String
  subjectsStudied: [String]
  strongSubjects: [String]
  gpa: Number
  cgpa: Number
  interestAreas: [String]
  preferredActivities: [String]
  analyticalSkills: String
  communicationSkills: String
  creativityLevel: String
  workPreference: String
  teamPreference: String
  careerGoal: String
  workEnvironment: String
  budget: String
  studyLocation: String
  needsScholarship: Boolean
  likedDegrees: [ObjectId -> Degree]
  dislikedDegrees: [ObjectId -> Degree]
  department: String
  semester: Number
  skillLevel: String
  interests: [String]
}
```

### Degree

```text
Degree {
  _id: ObjectId (PK)
  name: String
  shortName: String
  field: String
  description: String
  duration: String
  requiredSubjects: [String]
  requiredStream: [String]
  minGPA: Number
  universities: [{ ... }]
  careerOutcomes: [String]
  expectedSalary: String
  jobMarket: String
  idealInterestAreas: [String]
  idealActivities: [String]
  idealAnalytical: String
  idealCreativity: String
  workType: String
  successRate: Number
  averageRating: Number
  isActive: Boolean
}
```

### Course

```text
Course {
  _id: ObjectId (PK)
  courseCode: String (unique)
  title: String
  description: String
  department: String
  degree: ObjectId (FK -> Degree)
  creditHours: Number
  difficultyLevel: String
  semesterOffered: Number
  prerequisites: [ObjectId -> Course]
  tags: [String]
  careerOutcomes: [String]
  skillsGained: [String]
  successRate: Number
  averageRating: Number
  totalEnrollments: Number
  isCore: Boolean
  category: String
  relevantSubjects: [String]
  skillTags: [String]
  careerTags: [String]
  isActive: Boolean
}
```

### Preference

```text
Preference {
  _id: ObjectId (PK)
  student: ObjectId (FK -> Student) (unique)
  likedDegrees: [ObjectId -> Degree]
  dislikedDegrees: [ObjectId -> Degree]
}
```

### DegreeEnrollment

```text
DegreeEnrollment {
  _id: ObjectId (PK)
  student: ObjectId (FK -> Student)
  degree: ObjectId (FK -> Degree)
  status: String (enrolled/removed)
  enrolledAt: Date
}
```

## Relationships Summary

```text
Student          -> Preference       : One to One
Student          -> DegreeEnrollment : One to Many
Student          -> Degree           : Many to Many through likedDegrees and dislikedDegrees
Degree           -> Course           : One to Many
Degree           -> DegreeEnrollment : One to Many
Course           -> Course           : Many to Many through prerequisites
```
