# Software Requirements Specification (SRS)

## AI-Based Intelligent Course Recommendation System

**Version:** 1.0  
**Date:** February 2026  
**Project Code:** KHSIP-2026-MG-0004

---

## 1. Introduction

### 1.1 Purpose

This document describes the software requirements for an AI-Based
Intelligent Course Recommendation System. The system recommends
courses to students based on their academic performance, interests,
skill level, and career goals using content-based filtering.

### 1.2 Scope

The system is a web application that allows students to:

- Register and manage their academic profile
- Receive AI-powered personalized course recommendations
- Enroll in recommended courses
- Track their grades and CGPA
- Provide feedback on recommendations

### 1.3 Target Users

- **Students** — primary users who receive recommendations
- **Admins** — manage course catalog

---

## 2. System Overview

### 2.1 Problem Statement

Students often struggle to choose the right courses due to lack of
guidance. Traditional advising is time-consuming and not personalized.
This system provides data-driven, personalized recommendations.

### 2.2 Solution

An AI engine that analyzes:

- Student interests and career goals
- Past academic performance (grades/CGPA)
- Skill level
- Course difficulty and outcomes
- Student feedback (liked/disliked courses)

---

## 3. Functional Requirements

### 3.1 Authentication

- FR-01: Student can register with personal and academic info
- FR-02: Student can login with email and password
- FR-03: Passwords are encrypted using bcrypt
- FR-04: JWT token issued on login for session management

### 3.2 Student Profile

- FR-05: Student can view their profile
- FR-06: Profile includes name, department, semester, CGPA
- FR-07: Student can set interests and career goals

### 3.3 Course Management

- FR-08: Admin can add/update/delete courses
- FR-09: Students can view all available courses
- FR-10: Each course has tags, difficulty, outcomes, success rate

### 3.4 Recommendation Engine

- FR-11: System generates personalized course recommendations
- FR-12: Recommendations ranked by AI score
- FR-13: Each recommendation includes explanation (why recommended)
- FR-14: Engine uses interests, career goals, skill level, grades
- FR-15: Feedback loop updates recommendations based on likes/dislikes

### 3.5 Enrollment

- FR-16: Student can enroll in recommended courses
- FR-17: System prevents duplicate enrollments
- FR-18: Enrollment status tracked (enrolled/completed/failed/dropped)

### 3.6 Grades

- FR-19: Students can add grades for completed courses
- FR-20: Letter grade auto-calculated from marks
- FR-21: CGPA auto-updated after each grade entry

### 3.7 Feedback

- FR-22: Students can like/dislike recommended courses
- FR-23: Liked courses get score boost in future recommendations
- FR-24: Disliked courses are removed from recommendations

---

## 4. Non-Functional Requirements

- NFR-01: Response time under 2 seconds
- NFR-02: Passwords never stored in plain text
- NFR-03: All protected routes require valid JWT token
- NFR-04: System works on all modern browsers
- NFR-05: RESTful API design

---

## 5. Technology Stack

| Layer    | Technology            |
| -------- | --------------------- |
| Frontend | HTML, CSS, JavaScript |
| Backend  | Node.js, Express.js   |
| Database | MongoDB, Mo           |
