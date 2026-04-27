# API Documentation

## Degree Recommendation System

Base URL: `http://localhost:5000/api`

---

## Authentication

### Register Student

`POST /auth/register`

**Body:**

```json
{
  "name": "Ahmed Ali",
  "email": "ahmed@test.com",
  "password": "abc12345",
  "studentId": "CS-2021-001",
  "educationLevel": "intermediate",
  "majorStream": "science",
  "subjectsStudied": ["Mathematics", "Physics", "Computer Science"],
  "strongSubjects": ["Mathematics", "Computer Science"],
  "gpa": 3.4,
  "interestAreas": ["Technology", "Engineering"],
  "preferredActivities": ["Problem Solving", "Research"],
  "careerGoal": "Software Engineer",
  "budget": "medium",
  "studyLocation": "local"
}
```

**Response:** student object plus JWT token

### Login

`POST /auth/login`

**Body:**

```json
{
  "email": "ahmed@test.com",
  "password": "abc12345"
}
```

**Response:** student object plus JWT token

### Get Profile

`GET /auth/profile`

**Headers:** `Authorization: Bearer <token>`

**Response:** authenticated student profile

---

## Degrees

### Get All Active Degrees

`GET /degrees`

**Headers:** `Authorization: Bearer <token>`

### Get Degree By Id

`GET /degrees/:id`

**Headers:** `Authorization: Bearer <token>`

### Create Degree

`POST /degrees`

**Headers:** `Authorization: Bearer <admin-token>`

### Update Degree

`PUT /degrees/:id`

**Headers:** `Authorization: Bearer <admin-token>`

### Deactivate Degree

`DELETE /degrees/:id`

**Headers:** `Authorization: Bearer <admin-token>`

**Note:** delete is implemented as deactivation through `isActive: false`.

---

## Courses

### Get All Courses

`GET /courses`

**Headers:** `Authorization: Bearer <token>`

### Get Course By Id

`GET /courses/:id`

**Headers:** `Authorization: Bearer <token>`

### Create Course

`POST /courses`

**Headers:** `Authorization: Bearer <admin-token>`

**Required fields:**

- `courseCode`
- `title`
- `description`
- `department`
- `creditHours`
- `difficultyLevel`

### Update Course

`PUT /courses/:id`

**Headers:** `Authorization: Bearer <admin-token>`

### Delete Course

`DELETE /courses/:id`

**Headers:** `Authorization: Bearer <admin-token>`

---

## Recommendations

### Get Degree Recommendations

`GET /recommendations`

**Headers:** `Authorization: Bearer <token>`

**Response shape:**

```json
{
  "student": "Ahmed Ali",
  "careerGoal": "Software Engineer",
  "totalDegreesAnalyzed": 8,
  "recommendations": [
    {
      "rank": 1,
      "degreeName": "BS Computer Science",
      "matchPercentage": 84,
      "score": 84,
      "whyRecommended": [
        "Strong match with mathematics and computing subjects",
        "Career goal aligns with software roles"
      ],
      "majorCourses": [
        {
          "courseCode": "CS301",
          "title": "Data Structures"
        }
      ],
      "breakdown": {
        "academic": "+12/15",
        "interests": "+10/10",
        "feedback": "+4/20"
      }
    }
  ]
}
```

---

## Preferences

### Create Preference Profile

`POST /preferences`

**Headers:** `Authorization: Bearer <token>`

### Get Preference Profile

`GET /preferences`

**Headers:** `Authorization: Bearer <token>`

### Update Preference Profile

`PUT /preferences`

**Headers:** `Authorization: Bearer <token>`

### Set Degree Feedback

`POST /preferences/degree-feedback`

**Headers:** `Authorization: Bearer <token>`

**Body:**

```json
{
  "degreeId": "<degree-id>",
  "action": "like"
}
```

**Valid actions:** `like`, `dislike`, `clear`

---

## Degree Enrollments

### Get My Degree Enrollments

`GET /degree-enrollments`

**Headers:** `Authorization: Bearer <token>`

### Enroll In Degree

`POST /degree-enrollments/:degreeId`

**Headers:** `Authorization: Bearer <token>`

### Remove Degree Enrollment

`DELETE /degree-enrollments/:degreeId`

**Headers:** `Authorization: Bearer <token>`

---

## Admin

### Get Admin Summary

`GET /admin/summary`

**Headers:** `Authorization: Bearer <admin-token>`

### Get All Students

`GET /admin/students`

**Headers:** `Authorization: Bearer <admin-token>`

### Get All Degree Enrollments

`GET /admin/degree-enrollments`

**Headers:** `Authorization: Bearer <admin-token>`

### Update Degree Enrollment Status

`PATCH /admin/degree-enrollments/:id`

**Headers:** `Authorization: Bearer <admin-token>`

### Delete Student

`DELETE /admin/students/:id`

**Headers:** `Authorization: Bearer <admin-token>`
