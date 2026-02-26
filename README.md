# AI-Based Intelligent Course Recommendation System

**Project Code:** KHSIP-2026-MG-0004

## Overview

A full-stack web application that uses AI (content-based filtering)
to recommend personalized courses to students based on their
academic profile, interests, and career goals.

## Features

- JWT Authentication (Register/Login)
- AI Recommendation Engine with scoring
- Course enrollment system
- Grade tracking with auto CGPA calculation
- Feedback loop (like/dislike improves recommendations)
- Responsive web frontend

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Auth:** JWT + bcryptjs

## Setup Instructions

### Prerequisites

- Node.js installed
- MongoDB installed locally

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create `backend/.env`:

```
PORT=5000
MONGO_URI=mongodb://localhost:27017/course_recommender
JWT_SECRET=course_recommender_secret_key_2026
```

### Run

```bash
# Start MongoDB
mongod

# Start backend
cd backend
npm run dev

# Open frontend
Open frontend/pages/login.html with Live Server
```

## API Base URL

`http://localhost:5000/api`

## Project Structure

```
course-recommender/
├── backend/
│   ├── config/        # Database connection
│   ├── models/        # MongoDB schemas
│   ├── routes/        # API endpoints
│   ├── controllers/   # Business logic
│   ├── middleware/    # Auth + validation
│   ├── utils/         # Recommendation engine
│   └── server.js
├── frontend/
│   ├── css/           # Styles
│   ├── pages/         # HTML pages
└── docs/              # Documentation
```

## Recommendation Algorithm

Scores each course based on:

- Interest matching (+20 per match)
- Career goal alignment (+25)
- Skill level compatibility (+15)
- Grade performance in similar courses (+10)
- Student feedback/preferences (+30 for liked)
- Course success rate and rating (+10)
