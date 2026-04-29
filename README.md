# AI-Based Degree Recommendation System

**Project Code:** KHSIP-2026-MG-0004

## Overview

A full-stack academic guidance platform that helps students identify the most suitable degree programs based on academic background, interests, strengths, career goals, and practical constraints. Each recommendation also surfaces linked courses so students can understand the pathway inside a degree before enrolling.

## Core Features

- Cookie-backed JWT authentication with httpOnly session cookies
- Degree recommendation engine with weighted scoring
- Degree-specific course pathway suggestions
- Degree enrollment with duplicate prevention and restore flow
- Degree feedback loop through like and dislike actions
- Admin management for degrees, courses, students, and enrollments
- Responsive static web frontend

## Tech Stack

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Authentication:** JWT + bcryptjs + httpOnly cookies
- **Deployment Targets:** Vercel, Railway, MongoDB Atlas

## Local Setup

### Prerequisites

- Node.js 20+
- MongoDB running locally

### Installation

```bash
cd backend
npm install
```

### Environment Variables

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/degree_recommender
JWT_SECRET=replace-with-a-long-random-secret-at-least-32-characters
JWT_EXPIRES_IN=7d
CORS_ORIGINS=http://localhost:5500
API_RATE_LIMIT_MAX=300
AUTH_RATE_LIMIT_MAX=20
LOG_LEVEL=info
ALERT_WEBHOOK_URL=
```

### Run

```bash
# Start MongoDB
mongod

# Start backend
cd backend
npm install
npm run dev

# Seed sample degree data (optional)
npm run seed:degrees
npm run seed:courses

# Replace existing degree catalog only when you explicitly want a full reset
npm run seed:degrees:replace

# Open frontend from the repo root
npm run frontend
```

## API Base URL

`http://localhost:5000/api`

## Quality Checks

```bash
cd backend
npm run check
npm test
npm audit --omit=dev

# From the repo root
npm run check:frontend
npm run test:frontend
npm run test:e2e
```

## Production Notes

- Backend now emits structured JSON logs with request IDs for request and error tracing.
- Backend now supports cookie-based auth across the Vercel + Railway deployment flow.
- `npm run seed:degrees` is safe-by-default and merges sample degrees with existing records.
- Only `npm run seed:degrees:replace` clears existing degrees before reseeding.
- Admin and student actions now use consistent success/error toast notifications across the live UI.
- Admin actions and auth events are stored in audit logs available at `/api/admin/audit-logs`.
- `ALERT_WEBHOOK_URL` can be set to forward startup, database, and 5xx alerts to an external monitoring webhook.
- Frontend automated tests run with `npm run test:frontend`, and deployment smoke coverage can be pointed at a live API with `E2E_API_URL`.

## Deployment Targets

- Frontend: Vercel
- Backend API: Railway
- Database: MongoDB Atlas

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for the production deployment flow.

## Project Structure

```text
Degree_recommendation_system/
|-- backend/
|   |-- config/        # Database and environment setup
|   |-- controllers/   # API request handlers
|   |-- middleware/    # Auth, validation, and error handling
|   |-- models/        # MongoDB schemas
|   |-- routes/        # REST API endpoints
|   |-- utils/         # Degree recommendation engine
|   `-- server.js      # Backend entry point
|-- frontend/
|   |-- css/           # Stylesheets
|   |-- js/            # Runtime config and page logic
|   `-- pages/         # Static HTML pages
|-- docs/              # Project documentation
`-- tools/             # Local development utilities
```

## Recommendation Logic

Degrees are scored using weighted factors:

- Academic match: 40%
- Interest match: 30%
- Skills and learning style: 15%
- Career alignment: 10%
- Constraints: 5%

Feedback from liked and disliked degrees is then applied as an additional adjustment layer before the final ranked results are returned.
