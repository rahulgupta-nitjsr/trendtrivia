# TrendTrivia Phase 2: AI-Driven Dynamic Content & Modular Backend (Draft 2)

**Version:** 2.0  
**Date:** [To be filled]  
**Author:** [Product/Tech Team]  

---

## Table of Contents

1. Project Motivation & Background
2. Solution Overview & Goals
3. System Architecture Overview
4. Workflow: End-to-End Data Pipeline
5. Flexible Data Model & Schema Design
6. AI Content Generation & Prompt Management
7. Validation & Quality Assurance Pipeline
8. Storage, Versioning & Rollback
9. API, Rate Limiting, and Error Handling
10. Prompt Traceability & Audit Logging
11. Frontend/UI Consumption
12. Analytics, Monitoring & Metrics
13. Security & Best Practices
14. Extensibility, Future-proofing & Best Practices
15. Critique, Blind Spots & Enhancements (NEW)
16. Appendix: Roles and Responsibilities
17. Changelog
18. Contacts

---

## 1. Project Motivation & Background

After a successful MVP, TrendTrivia must now scale to deliver fresh, weekly content that aligns with its mission: *turning passive news into active, engaging learning*.

**Challenges solved:**
- Static local JSON content ➔ Dynamic, regularly generated AI-driven content
- Manual content update ➔ Automated, auditable pipeline
- Rigid schema ➔ Flexible, future-proof data structure
- No admin/audit trail ➔ Versioned, rollback-able, traceable system

**Whiteboard/Diagram Context:**
- Weekly refresh of questions
- Robust data handling/storage (JSON ➔ DB)
- Use of AI service for latest data
- Data stored in DB, used in UI
- API key/calls, prompt management, DB creation/modification, response structure, and periodic refreshes

---

## 2. Solution Overview & Goals

**Objectives:**
- Automate weekly question creation using AI models
- Store all questions/batches in a scalable database
- Support schema evolution—add/modify/remove question properties mid-flight, with no downtime
- Enforce data validation and content moderation (AI + manual review)
- Allow prompt storage, traceability, and batch/version rollback
- Support seamless API integration for client UI with minimal refactors

---

## 3. System Architecture Overview

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
| (auto review)   |
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

## 4. Workflow: End-to-End Data Pipeline

### 4.1 Automated Generation
- Scheduler triggers (weekly or manually)
- Compose Prompt (category, timeframe, requirements)
- API Call to AI model, using prompt and secured keys
- Receive Data Block (array of new MCQs, flexible format)

### 4.2 Validation & Moderation
- Automatic QA: field presence, valid answer, profanity/NSFW, option count, dedupe, length checks
- Admin/Manual QA: flag/approve/edit in dashboard

### 4.3 Storage/Batching
- Store approved batch in DB: includes batch meta, original prompt, result, timestamps
- Tag as ‘current live’; archive old if needed

### 4.4 Rollback & Versioning
- On error, revert to last batch or another version via admin panel

### 4.5 Client/UI Consumption
- Frontend API fetches “current” or filtered batch (by set, date, tag, etc)
- UI dynamically renders all present fields; unknown fields are ignored without error

### 4.6 Monitoring
- Log and alert: success, failures, admin edits, batch states, weekly completion, etc

---

## 5. Flexible Data Model & Schema Design

- **Core Principle:** New properties can be added anytime without breaking old content or UI.

### Example Question Block

```
{
  "id": "q_20250722_001",
  "set_id": "set_2025_07_22_wk30",
  "question": "Which company became the first to launch an AI-powered satellite in 2025?",
  "options": ["SpaceX", "Amazon", "Blue Origin", "Relativity"],
  "answer": "SpaceX",
  "details": "SpaceX partnered with OpenAI for onboard inference on Starlink satellites.",
  "category": "Technology",
  "difficulty": "Medium",
  "tags": ["AI", "Space", "2025"],
  "imageURL": null,
  "source": "OpenAI_GPT-5",
  "meta": {
    "generated_at": "2025-07-22T00:00:00Z",
    "reviewed": true,
    "flagged": false,
    "reviewed_by": "admin@trendtrivia.com"
  },
  "extras": {
    "lang": "en",
    "explanation": null
  }
}
```

**Required fields:**  
- `question`, `options`, `answer`, `set_id`, `category` , `details`
**Optional/future fields:**  
- `difficulty`, `tags`, `imageURL`, `meta`, `extras`

---

## 6. AI Content Generation & Prompt Management

### 6.1 Prompt Construction
- Prompts specify question types, categories, duration (last week/month/year), format requirements, and additional instructions (e.g., “return MCQs as JSON objects with fields: ...”).

### 6.2 Prompt Storage
- Every prompt used is saved, with parameters and hash, linked to the question batch for reproducibility.

### 6.3 Model Metadata
- Each question includes a `source` field (AI model/version), API params if relevant.

---

## 7. Validation & Quality Assurance Pipeline

### 7.1 Automated Checks
- Field population (question/options/answer)
- Options length (usually 4, but flexible)
- Answer in options check
- Unique question detection (across batch/history)
- Profanity/NSFW
- Answer is plausible, not “All of the above” unless allowed
- Length checks (min/max for question/details)
- JSON parse and schema validation

### 7.2 Manual/Admin Review
- Admin dashboard to view/add/edit/flag/reject questions.
- Logs all admin actions and decisions with timestamp and user.

---

## 8. Storage, Versioning & Rollback

### 8.1 Batch Storage
- Batches are stored as collections/arrays with:
  - `set_id` (unique, time/version-based)
  - Prompt and API call metadata
  - Submission/result timestamps

### 8.2 Versioning
- Only one batch per category/timeframe is ‘active’ at a time.
- Prior batches are archived—but any may be restored in a hotfix.

### 8.3 Rollback
- Admin panel exposes “roll back to...” or “make active” batch.
- All questions maintain audit trail for their origin.

---

## 9. API, Rate Limiting and Error Handling

- API keys and calls are handled only on backend (never client).
- Exponential backoff for API failures; logs for all responses.
- Retries configurable; alerts on persistent errors.
- API responses stored in DB for audit/debug.

---

## 10. Prompt Traceability & Audit Logging

- Every batch links prompt, model params, and AI-generated answers.
- All admin edits, deletes, manual reviews are logged.
- Prompts + responses are stored for LLM fine-tuning and issue diagnosis.
- Each question stores:
  - `set_id`, batch info  
  - Prompt (full text/hash)
  - Operator (AI/LLM or human origin)

---

## 11. Frontend/UI Consumption

- REST/GraphQL endpoint returns array of MCQs for each session.
- UI “QuestionCard” component displays all fields if present.
- Optional/experimental fields render conditionally—UI never crashes on extra fields.
- Client supports filtering/selection by category, timeframe, difficulty, tags, etc.

---

## 12. Analytics, Monitoring & Metrics

- **Backend:**  
  - Batch health and validation pass/fail rates
  - AI cost and prompt/token usage
  - Admin review actions, rollout times
- **Frontend:**  
  - Question attempts/completions per batch and user
  - Per-question analytics: most-played, difficulty by success rate
- **Alerting:**
  - Failed batch generations
  - Validation failure spikes
  - Slow API/DB response

---

## 13. Security Best Practices

- API keys stored server-side, never client-exposed
- Output sanitization to prevent XSS in UI
- Rate limit and throttle all AI/DB API calls
- All admin actions require authentication and are logged

---

## 14. Extensibility, Future-Proofing & Best Practices

- Use document/NoSQL DB (Firestore, MongoDB) for max schema flexibility
- Store “extras” as open bag for future needs
- UI always uses safe “existence checks” for optional fields
- Prompts/results stored for future LLM improvement and model swaps
- Admin dashboard allows editing batches without code push
- Multilanguage support—just add a `lang` field in the schema
- Open for integrating voice/audio/image based MCQs (add property)

---

## 15. Critique, Blind Spots & Enhancements (NEW)

### A. AI Content Quality & Prompt Engineering
- Add a feedback loop: failed/flagged questions should inform prompt refinement.
- Consider A/B testing prompts or models to optimize question quality over time.

### B. Manual QA/Admin Dashboard
- Clarify if admin dashboard is in scope for Phase II or future phase. If not, define interim manual QA process.
- Plan for bulk actions, search/filtering, and usability for large batches.

### C. Data Model Evolution
- Document a versioning strategy for the schema itself, not just data batches.
- Plan for migration tooling or scripts if required fields are renamed/removed.

### D. API Design
- Draft OpenAPI/GraphQL schema for endpoints, including authentication, pagination, and filtering.
- Add rate limiting/throttling to public API, not just backend AI calls.

### E. Testing & Staging
- Define test environments, staging DBs, and validation before going live.
- Add a “preview” mode for admins to see new batches in the UI before activation.

### F. Internationalization
- Document how prompts, validation, and UI will handle multiple languages, including RTL and non-Latin scripts.

### G. Cost & Rate Management
- Set up budget alerts for AI API usage, and consider quotas to prevent runaway costs.

### H. Disaster Recovery
- Document a backup/restore process for the DB and critical data.

---

## 16. Appendix: Roles and Responsibilities

- **Backend/Infra:**  
  - Automate ingestion, handle validation, storage, and error/alerting
- **Prompt Engineer/AI Lead:**  
  - Prompt curation, AI selection/tuning, QA of output
- **Admin/QA:**  
  - Manual review, batch activation/rollback
- **Frontend:**  
  - UI for flexible display, admin panel, dynamic component rendering
- **Product Manager:**  
  - Roadmap, documentation, ongoing QA alignment

---

## 17. Changelog

- **2025-07-22:** Document written and reviewed, full end-to-end pipeline defined
- **[Today]:** Draft 2 created, incorporating critique, blind spots, and enhancements

---

## 18. Contacts

- Product Owner: [Your Name/Email]
- Backend Lead: [Tech Contact]
- AI/Prompt Engineer: [Contact]
- Frontend Lead: [Contact]
- QA/Admin: [Contact]

---

*This document is the living blueprint for TrendTrivia’s scalable, dynamic, and robust content system—ensuring lasting product agility and high content quality as the platform evolves.* 