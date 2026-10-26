# CareerAI — AI-Based Career Recommendation System

CareerAI is an intelligent full-stack career guidance and recommendation platform that analyzes student interests, skills, academic background, and work preferences to deliver personalized career matches and structured 5-phase learning roadmaps.

---

## Key Features

1. **Intelligent Multi-Vector Assessment Engine**:
   - 5-step guided assessment analyzing:
     - Academic coursework, degree program, and GPA standing.
     - Core passions and interest domains.
     - Self-reported proficiency across 10 key technical and soft skills.
     - Work environment preferences (remote, hybrid, onsite), collaboration style, and task orientation.
     - Transparent scoring weights customizer (Interest, Skill, Academic, Work Dynamics).
   - Powered by Gemini 3.8 Flash with a server-side JSON schema and robust rule-based fallback.

2. **Personalized 5-Phase Learning Roadmaps**:
   - Structured milestone progression for every recommended career:
     - Phase 1: Core Fundamentals & Essential Tooling
     - Phase 2: Intermediate Concepts & Applied Frameworks
     - Phase 3: Specialized Domain Mastery
     - Phase 4: Portfolio Capstone Building
     - Phase 5: Certifications, Interview Prep & Career Launch
   - Interactive checklist with real-time milestone progress tracking saved to the database.

3. **Curated Career Directory**:
   - Filterable catalog of high-demand technology and business roles.
   - Comprehensive role descriptions, typical workday insights, required core skills, and accredited learning resources.
   - Ground truth salary estimates citing official US Bureau of Labor Statistics (BLS 2024–2034) data.

4. **Security & Authentication**:
   - Secure account registration and login with salt-based scrypt password hashing.
   - Session tokens with protected API routes.
   - Role-based authorization (`student` vs `admin`).
   - Password reset workflow with verification codes.

5. **Student & Admin Portals**:
   - Student Dashboard with profile completion meter, top matches, interactive roadmaps, and saved careers.
   - Admin Console with aggregate platform telemetry, career catalog CRUD management, and audit logs.

---

## Demo Credentials

For immediate testing, two pre-configured accounts are provided with full seed data:

- **Demo Student**:
  - Email: `student@careerai.dev`
  - Password: `Student123!`
  - Role: `student` (has completed assessment, 94% AI match, active roadmap)

- **Demo Administrator**:
  - Email: `admin@careerai.dev`
  - Password: `Admin123!`
  - Role: `admin` (access to Admin Portal, catalog CRUD, audit trail)

---

## Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS 4, Lucide Icons, Canvas Confetti
- **Backend**: Express full-stack on Node.js (via `server.ts`), Vite Dev Server middleware
- **AI Integration**: `@google/genai` (model: `gemini-3.8-flash`) on server-side
- **Database**: Persistent JSON store with automated file backups in `/data`
