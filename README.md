# 🚀 AI Interview Platform

> An AI-powered mock interview platform that simulates real-world technical, HR, coding, and system design interviews using Groq AI, automated evaluation, coding assessments, webcam monitoring, and performance analytics.

![Status](https://img.shields.io/badge/Status-Active%20Development-success)
![Frontend](https://img.shields.io/badge/Frontend-React-blue)
![Backend](https://img.shields.io/badge/Backend-Node.js-green)
![Database](https://img.shields.io/badge/Database-Neon%20PostgreSQL-blueviolet)
![AI](https://img.shields.io/badge/AI-Groq-orange)

---

## 🎯 Project Vision

Preparing for interviews can be stressful and inconsistent.

This platform acts as a virtual interviewer that:

✅ Generates AI-powered interview questions

✅ Conducts mock interviews

✅ Evaluates responses automatically

✅ Tracks interview performance

✅ Simulates coding interviews

✅ Analyzes communication skills

---

## ✨ Features

| Feature                     | Status         |
| --------------------------- | -------------- |
| 🔐 JWT Authentication       | ✅ Completed    |
| 👤 User Dashboard           | ✅ Completed    |
| 🤖 AI Question Generation   | ✅ Completed    |
| 📊 AI Evaluation & Feedback | ✅ Completed    |
| 📷 Webcam Monitoring        | ✅ Completed    |
| 📝 Monaco Code Editor       | ✅ Completed    |
| 💾 PostgreSQL Database      | ✅ Completed    |
|  Coding Interview Mode    | 🚧 In Progress |
|  Judge0 Compiler           | 🚧 In Progress |
|  Speech Recognition       | 📅 Planned     |
|  AI Voice Interviewer     | 📅 Planned     |
|  Interview Analytics      | 📅 Planned     |

---

## 🏗️ System Architecture

```text
┌─────────────────┐
│ React Frontend  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Express Backend │
└────────┬────────┘
         │
         ├────────► Groq AI
         │            │
         │            ▼
         │     Questions & Evaluation
         │
         ▼
┌─────────────────┐
│ Neon PostgreSQL │
└─────────────────┘
```

---

## 🔄 Interview Workflow

```text
Interview Setup
        ↓
AI Generates Questions
        ↓
Candidate Answers
        ↓
AI Evaluation
        ↓
Score + Feedback
        ↓
Performance Review
```

---

## 💻 Coding Interview Workflow

```text
Coding Problem
      ↓
Monaco Editor
      ↓
Run Code
      ↓
Judge0 Compiler
      ↓
Test Cases
      ↓
AI Evaluation
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Tailwind CSS
* Monaco Editor
* React Webcam

### Backend

* Node.js
* Express.js
* JWT Authentication
* Prisma ORM

### Database

* Neon PostgreSQL

### AI

* Groq API

### Upcoming

* Judge0
* Speech Recognition API
* Speech Synthesis API

---

## 📸 Screenshots

### 🏠 Dashboard

(Add Screenshot)

### 🎤 Interview Room

(Add Screenshot)

### 📊 Results Page

(Add Screenshot)

### 💻 Coding Interview

(Add Screenshot)

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/vinn31-git/Interview-Platform-AI.git
cd Interview-Platform-AI
```

### Frontend

```bash
cd Phase1
npm install
npm run dev
```

### Backend

```bash
cd Phase2
npm install
npm run dev
```

### Environment Variables

```env
DATABASE_URL=your_database_url
JWT_SECRET=your_secret
GROQ_API_KEY=your_groq_key
```

---

## 📌 Current Progress

```text
Authentication           ██████████ 100%
Question Generation      ██████████ 100%
AI Evaluation            ██████████ 100%
Webcam Integration       ██████████ 100%
Monaco Editor            ██████████ 100%

Coding Mode              ███████░░░ 70%
Judge0 Integration       ░░░░░░░░░░ 0%
Speech Recognition       ░░░░░░░░░░ 0%
Analytics Dashboard      ░░░░░░░░░░ 0%
```

---

## 👨‍💻 Author

**Sahasra**

🔗 GitHub: https://github.com/vinn31-git

---

⭐ If you found this project interesting, consider starring the repository!
