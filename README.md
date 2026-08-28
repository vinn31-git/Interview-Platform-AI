# InterviewMate: AI-Powered Technical Interview Simulator

An intelligent mock interview platform designed to simulate real-world technical, HR, coding, and system design interviews. The system leverages large language models (LLMs) to provide dynamic question generation, real-time conversational interviewing, and comprehensive performance analytics.

![Status](https://img.shields.io/badge/Status-Active%20Development-success)
![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Database](https://img.shields.io/badge/Database-SQLite-blueviolet)
![AI](https://img.shields.io/badge/AI-Groq%20API-orange)

---

## 1. Project Overview

Preparing for technical interviews requires consistent practice and actionable feedback. InterviewMate acts as a virtual interviewer by providing a complete, end-to-end interview lifecycle:

- **Dynamic Question Generation:** Questions are tailored to the candidate's chosen role, experience level, and difficulty.
- **Interactive Mock Interviews:** Simulates a conversational flow with follow-up questions based on the candidate's previous answers.
- **Automated Evaluation:** Uses LLMs to holistically grade communication skills, technical accuracy, and problem-solving abilities.
- **Integrated Coding Environment:** Includes an embedded code editor for Data Structures & Algorithms (DSA) rounds.

---

## 2. System Architecture

The application follows a standard Client-Server architecture with a RESTful API communicating with a relational database and external AI services.

```text
┌─────────────────┐
│ React Frontend  │ (Vite, TailwindCSS, Monaco Editor)
└────────┬────────┘
         │ HTTP/REST
         ▼
┌─────────────────┐
│ Express Backend │ (Node.js, Prisma ORM, JWT Auth)
└────────┬────────┘
         │
         ├────────► Groq API (LLM inference for generation & evaluation)
         │
         ▼
┌─────────────────┐
│ SQLite Database │ (Relational data storage)
└─────────────────┘
```

---

## 3. Key Features

- **Secure Authentication:** Implements JWT-based authentication using HTTP-only cookies to prevent Cross-Site Scripting (XSS) attacks.
- **AI-Driven Logic:** Integrates with the Groq API (using large models like `gpt-oss-120b`) for ultra-fast, context-aware interview simulations.
- **Webcam Integration:** Simulates a proctored or live interview environment.
- **Security Hardened:** Features strict API rate-limiting, CORS origin restrictions, global error handling, and JSON payload limits to prevent abuse and data leakage.
- **Coding Assessments:** Embedded Monaco Editor for live coding problem solving.

---

## 4. Technology Stack

**Client-Side (Frontend)**
- React.js (Vite)
- Tailwind CSS
- Monaco Editor
- React Webcam

**Server-Side (Backend)**
- Node.js & Express.js
- Prisma ORM
- JSON Web Tokens (JWT) & bcrypt
- Express Rate Limit

**Database & External Services**
- SQLite (Development)
- Groq AI API

---

## 5. Local Development Setup

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. **Clone the Repository**
   ```bash
   git clone https://github.com/vinn31-git/Interview-Platform-AI.git
   cd Interview-Platform-AI
   ```

2. **Configure Environment Variables**
   Navigate to the `Phase2` directory and create a `.env` file with the following variables:
   ```env
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your_secure_random_string_here_min_32_chars"
   GROQ_API_KEY="your_groq_api_key_here"
   FRONTEND_URL="http://localhost:5173"
   ```

3. **Start the Backend Server**
   ```bash
   cd Phase2
   npm install
   npx prisma generate
   npx prisma db push
   npm run dev
   ```

4. **Start the Frontend Client**
   Open a new terminal window:
   ```bash
   cd Phase1
   npm install
   npm run dev
   ```

---

## 6. Current Progress & Roadmap

- **Completed:** JWT Authentication, AI Question Generation, Conversational Interview Engine, Automated Evaluation, Database Schema (SQLite), Security Hardening.
- **In Progress:** Judge0 Compiler Integration for executable code validation.
- **Planned:** Speech-to-Text Recognition for verbal answers, comprehensive Analytics Dashboard for tracking historical performance.

---

## 7. Author

**Sahasra**  
GitHub: [vinn31-git](https://github.com/vinn31-git)
