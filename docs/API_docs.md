# API Documentation

## Course Recommender System

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
  "password": "123456",
  "studentId": "CS-2021-001",
  "department": "Computer Science",
  "semester": 5,
  "interests": ["Machine Learning"],
  "careerGoal": "Software Engineer",
  "skillLevel": "intermediate"
}
```

**Response:** Student object + JWT token

---

### Login

`POST /auth/login`

**Body:**

```json
{ "email": "ahmed@test.com", "password": "123456" }
```

**Response:** Student object + JWT token

---

### Get Profile

`GET /auth/profile`  
**Headers:** `Authorization: Bearer <token>`  
**Response:** Student profile object

---

## Courses

### Get All Courses

`GET /courses`  
**Headers:** `Authorization: Bearer <token>`  
**Response:** Array of course objects

### Create Course

`POST /courses`  
**Headers:** `Authorization: Bearer <token>`  
**Body:** Course object

### Update Course

`PUT /courses/:id`  
**Headers:** `Authorization: Bearer <token>`

### Delete Course

`DELETE /courses/:id`  
**Headers:** `Authorization: Bearer <token>`

---

## Recommendations

### Get Recommendations

`GET /recommendations`  
**Headers:** `Authorization: Bearer <token>`  
**Response:**

```json
{
  "student": "Ahmed Ali",
  "careerGoal": "Software Engineer",
  "totalCoursesAnalyzed": 5,
  "recommendations": [
    {
      "rank": 1,
      "title": "Machine Learning",
      "score": 75,
      "whyRecommended": ["Matches interests"]
    }
  ]
}
```

---

## Enrollments

### Enroll in Course

`POST /enrollments`  
**Body:** `{ "courseId": "...", "semester": 5, "academicYear": "2025-2026" }`

### Get My Enrollments

`GET /enrollments`

---

## Grades

### Add Grade

`POST /grades`  
**Body:** `{ "courseId": "...", "marks": 88, "semester": 5, "academicYear": "2025-2026" }`

### Get My Grades

`GET /grades`  
**Response:** `{ "cgpa": "3.50", "totalCourses": 2, "grades": [...] }`

---

## Preferences

### Create Preferences

`POST /preferences`

### Get Preferences

`GET /preferences`

### Update Preferences

`PUT /preferences`
