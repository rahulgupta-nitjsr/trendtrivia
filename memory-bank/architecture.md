# **TrendTrivia - Technical Architecture**

Version: 4.0  
Last Updated: July 22, 2025

## **1. System Overview**

TrendTrivia is evolving from a static, client-only SPA to a robust, AI-powered, database-backed platform. Phase II introduces dynamic content generation, backend validation, versioning, and extensibility.

### **Core Architecture Principles**
- **Component-Based Design:** Modular React components for reusability
- **Backend-Driven Content:** All quiz data is now generated, validated, and served from a backend pipeline
- **Flexible Data Model:** NoSQL DB with schema evolution and versioning
- **Validation & Moderation:** Automated and manual QA for all content
- **Prompt Traceability:** All prompts, responses, and admin actions are logged
- **Auditability & Rollback:** Full versioning and rollback for all question batches
- **Extensibility:** Ready for multilanguage, media, and future content types

---

## **2. Technology Stack**

### **Frontend Framework**
- **React 18.2.0** - Component-based UI library
- **Vite 5.1.6** - Fast build tool and development server
- **JavaScript (ES6+)** - Modern JavaScript features

### **Backend & Data**
- **Node.js/Express or Serverless (Cloud Functions)** - API and backend logic
- **NoSQL DB (Firestore/MongoDB)** - Flexible, scalable question storage
- **OpenAI/Perplexity API** - AI-powered content generation (backend only)

### **Validation & Moderation**
- **Automated QA:** Field presence, answer validity, profanity, deduplication, length checks
- **Manual QA:** Admin dashboard or CLI for review, approval, and rollback

### **Monitoring & Analytics**
- **Batch health, validation rates, AI cost, admin actions, user engagement**

---

## **3. System Architecture Overview (Phase II)**

```
+------------------------+
|   AI Service (LLM API) |
+-----------+------------+
            |
            v
+-----------+------------+
| Content Backend Queue  |
+-----------+------------+
            |
            v
+-----------+------------+
| Validation Engine      |
| (auto + manual review) |
+-----------+------------+
            |
            v
+-----------+------------+
| Flexible Database (DB) |
| (NoSQL/JSON-based)     |
+-----------+------------+
            |
            v
+-----------+------------+
| REST/GraphQL API Layer |
+-----------+------------+
            |
            v
+-----------+------------+
|  TrendTrivia UI (SPA)  |
+------------------------+
```

---

## **4. Data Flow Architecture (Phase II)**

### **4.1. End-to-End Pipeline**
- Scheduler triggers prompt construction and AI API call
- AI response (batch of MCQs) is validated (auto + manual)
- Approved batch is stored in DB with prompt, metadata, and version
- API layer serves current/filtered batch to frontend
- All actions are logged for traceability and rollback

### **4.2. Data Model**
- Flexible schema: required (question, options, answer, set_id, category, details), optional (difficulty, tags, imageURL, meta, extras)
- Schema evolution: new fields can be added anytime, old content remains valid
- Versioning: each batch has unique set_id and can be rolled back

---

## **5. Validation, Moderation & Rollback**
- Automated checks: field presence, answer in options, profanity, deduplication, length
- Manual review: admin dashboard for approval, flagging, editing
- Rollback: admins can revert to previous batch/version at any time
- Audit trail: all actions, prompts, and responses are logged

---

## **6. API Layer & Frontend Integration**
- REST/GraphQL endpoints for fetching current/filtered questions
- Filtering by topic, timeframe, difficulty, tags, etc.
- Rate limiting and authentication for public API
- Frontend renders all present fields, ignores unknown fields

---

## **7. Monitoring, Analytics & Security**
- Batch health, validation pass/fail, AI cost, admin actions, user engagement
- API keys and secrets stored server-side only
- Output sanitization, rate limiting, and authentication
- Backup/restore process for disaster recovery

---

## **8. Extensibility & Future-Proofing**
- Multilanguage support (lang field, prompt/validation updates)
- Media MCQs (image/audio fields)
- Advanced analytics and admin dashboard expansion
- Schema versioning and migration tools

---

*This architecture is now fully aligned with the Phase II vision and backend draft. See the PRD for product goals and the implementation plan for actionable steps.*
