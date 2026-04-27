# Software Requirements Specification (SRS)

## AI-Based Degree Recommendation System

**Version:** 1.0  
**Date:** April 2026  
**Project Code:** KHSIP-2026-MG-0004

---

## 1. Introduction

### 1.1 Purpose

This document defines the software requirements for the AI-Based Degree Recommendation System. The platform helps students evaluate degree options using structured academic, preference, and career data, then presents ranked recommendations with supporting reasons and linked courses.

### 1.2 Scope

The system is a web application that allows students to:

- Register and maintain their academic and personal profile
- Receive AI-powered personalized degree recommendations
- Explore key courses linked to recommended degrees
- Enroll in recommended degree options
- Like or dislike degree suggestions to improve future results

### 1.3 Target Users

- **Students**: primary users who receive, review, and act on degree recommendations
- **Admins**: manage degrees, courses, students, and degree enrollments

---

## 2. System Overview

### 2.1 Problem Statement

Students often struggle to choose the right degree path because they must balance grades, subject strengths, interests, budget, study preferences, and long-term career plans. Traditional advising is time-consuming and not always personalized. The system addresses this by providing structured, repeatable, and data-driven degree recommendations.

### 2.2 Solution

An AI-assisted recommendation engine analyzes:

- Academic background and studied subjects
- Interests and preferred activities
- Skills and learning preferences
- Career goals and work environment preferences
- Budget, scholarship need, and study location constraints
- Student feedback on previously recommended degrees

---

## 3. Functional Requirements

### 3.1 Authentication

- FR-01: Student can register with personal, academic, and preference data
- FR-02: Student can log in with email and password
- FR-03: Passwords are encrypted using bcrypt
- FR-04: JWT token is issued on successful login for authenticated API access

### 3.2 Student Profile

- FR-05: Student can view their profile
- FR-06: Profile stores education history, stream, GPA or CGPA, and strengths
- FR-07: Student can update interests, activities, career goals, and constraints

### 3.3 Degree and Course Management

- FR-08: Admin can create, update, and deactivate degrees
- FR-09: Admin can create, update, and deactivate courses
- FR-10: Students can view active degrees and the linked courses for each degree

### 3.4 Recommendation Engine

- FR-11: System generates personalized degree recommendations
- FR-12: Recommendations are ranked by score
- FR-13: Each recommendation includes a reason or score breakdown
- FR-14: Engine uses academic fit, interests, skills, career goals, and constraints
- FR-15: Feedback loop adjusts future recommendations based on liked and disliked degrees

### 3.5 Degree Enrollment

- FR-16: Student can enroll in recommended degrees
- FR-17: System prevents duplicate active enrollments for the same degree
- FR-18: Enrollment status is tracked as enrolled or removed

### 3.6 Feedback

- FR-19: Student can like a recommended degree
- FR-20: Student can dislike a recommended degree
- FR-21: Student can clear prior degree feedback when needed

### 3.7 Administration

- FR-22: Admin can view student records
- FR-23: Admin can view summary statistics for degrees, courses, students, and enrollments
- FR-24: Admin can update degree enrollment status
- FR-25: Admin can remove student accounts when required

---

## 4. Non-Functional Requirements

- NFR-01: Recommendation and lookup responses should generally complete within a few seconds
- NFR-02: Passwords must never be stored in plain text
- NFR-03: All protected routes require a valid JWT token
- NFR-04: System must work on modern desktop and mobile browsers
- NFR-05: Backend must expose a RESTful API
- NFR-06: Backend health endpoint must be available for monitoring
- NFR-07: Application should be deployable on Vercel, Railway, and MongoDB Atlas
- NFR-08: Validation errors should return client-safe messages instead of generic server failures

---

## 5. Technology Stack

| Layer | Technology |
| --- | --- |
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | MongoDB |
| Authentication | JWT, bcryptjs |
| Deployment | Vercel, Railway, MongoDB Atlas |
