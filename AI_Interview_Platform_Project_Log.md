# AI Interview Platform -- Project Docs

## Project

**InterviewMate AI** -- Full-Stack AI-Powered Interview Preparation
Platform

------------------------------------------------------------------------

# Tech Stack

## Frontend

-   React.js (Vite)
-   Tailwind CSS
-   Shadcn UI
-   React Router
-   Monaco Editor
-   React Webcam
-   Axios
-   Web Speech API (Speech Recognition + Speech Synthesis)

## Backend

-   Node.js
-   Express.js
-   JWT Authentication
-   bcrypt

## Database

-   PostgreSQL (Neon) --> SQL Lite
-   Prisma ORM

## AI / External APIs

-   Groq API (Question Generation & Evaluation)
-   Judge0 API (Code Execution)

------------------------------------------------------------------------

# Current Architecture

    Landing
       ↓
    Login / Signup
       ↓
    Dashboard
       ↓
    Interview Setup
       ↓
    Generate Questions (Groq)
       ↓
    Interview Room
       ├── AI Questions
       ├── Timer
       ├── Webcam
       ├── Voice (TTS)
       ├── Speech To Text
       ├── Monaco Editor
       ├── Judge0 Execution
       └── Answer Submission
       ↓
    Results
       ↓
    AI Evaluation

------------------------------------------------------------------------

# Backend

Completed: - JWT Authentication - Signup/Login - Prisma + PostgreSQL -
Interview APIs - Groq Question Generation - Groq Evaluation - Judge0
Code Execution API

Routes: - /api/auth - /api/interviews - /api/groq - /api/evaluation -
/api/judge0/run

------------------------------------------------------------------------

# Frontend

Completed: - Landing Page - Login - Signup - Protected Routes -
Dashboard - Interview Setup - Interview Room - Results Page

Interview Room Features: - Dynamic Question Display - Progress Bar -
Dynamic Timer - Monaco Editor - Language Selector - Judge0 Integration -
Output Console - Webcam Feed - Text-to-Speech - Speech-to-Text - Answer
Submission - Navigation Between Questions

Supported Languages: - JavaScript - Python - Java - C++ - C

------------------------------------------------------------------------

# Database

User - Authentication - Profile

Interview - Role - Experience - Difficulty - Interview Type - Duration -
Questions - Answers - Evaluation - Score

------------------------------------------------------------------------

# System Design Decisions

1.  Keep frontend and backend separated.
2.  Use PostgreSQL + Prisma instead of MongoDB.
3.  Store interview metadata locally during active session.
4.  Use Groq for LLM-based question generation and evaluation.
5.  Use Judge0 for isolated code execution.
6.  Keep architecture simple and interview-friendly (avoid
    Redux/Zustand).
7.  Incrementally enhance UI instead of major rewrites.

------------------------------------------------------------------------

# Major Features Completed

-   Authentication
-   Protected Routing
-   AI Question Generation
-   AI Evaluation (basic)
-   Monaco Editor
-   Judge0 Integration
-   Multi-language Execution
-   Webcam Integration
-   Dynamic Timer
-   Progress Bar
-   Speech-to-Text
-   Text-to-Speech
-   Interview Flow
-   Results Page

Estimated Progress: **\~85%**

------------------------------------------------------------------------

# Remaining Features

## High Priority

-   Improve AI evaluation quality
-   Better evaluation prompt
-   Detailed scoring
-   Communication score
-   Technical score
-   Problem-solving score
-   Better feedback report

## Dashboard

-   Interview history
-   Previous scores
-   View detailed reports
-   Analytics cards

## UI / UX

-   Dark theme (violet / dark blue)
-   Better graphics
-   Framer Motion animations
-   Improved AI interviewer panel
-   Better responsive design

## AI

-   Automatic question narration
-   More natural interview flow
-   Better speech recognition handling
-   Optional conversation memory

## Coding

-   DSA problem viewer
-   Constraints
-   Examples
-   Input box for custom test cases

## Future SaaS Features

-   Admin dashboard
-   Company-specific interview sets
-   Resume upload
-   PDF report generation
-   Email reports
-   User profile
-   Leaderboard
-   Interview sharing
-   Deployment
-   CI/CD
-   Docker

------------------------------------------------------------------------

# Resume Highlights

-   Full-stack AI interview platform
-   LLM integration
-   Judge0 execution
-   Multi-language coding environment
-   Voice-enabled interviews
-   PostgreSQL + Prisma
-   JWT authentication

------------------------------------------------------------------------



# Safe Checkpoint

Current project is stable. Judge0, voice features, authentication,
interview flow, and coding environment are working. Next development
should focus on AI evaluation and dashboard analytics rather than adding
new infrastructure.
