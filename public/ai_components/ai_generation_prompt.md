# Enhanced AI Quiz Generation Prompt - Default

## CRITICAL REQUIREMENTS - READ CAREFULLY:

### EXACT OUTPUT REQUIREMENTS:
- You MUST provide exactly 40 questions total (not 39, not 41, exactly 40)
- You MUST provide exactly 10 questions for EACH category:
  * Technology: exactly 10 questions
  * Pop Culture: exactly 10 questions
  * Finance: exactly 10 questions
  * Start-Ups: exactly 10 questions

### SELF-VALIDATION PROCESS:
Before submitting your response, you MUST:

1. **COUNT CHECK**: Count your questions by category
   - Technology: ___ questions (must be 10)
   - Pop Culture: ___ questions (must be 10)
   - Finance: ___ questions (must be 10)
   - Start-Ups: ___ questions (must be 10)
   - TOTAL: ___ questions (must be 40)

2. **QUALITY CHECK**: Ensure each question has:
   - Clear, specific question text
   - Exactly 4 answer options (A, B, C, D)
   - One correct answer clearly marked
   - Proper category assignment (Technology, Pop Culture, Finance, Start-Ups)
   - Recent, verifiable information
   - A "details" field with a brief news context or source
   - A "difficulty" field (Easy, Medium, Hard)

### ERROR CORRECTION INSTRUCTIONS:
If your count is wrong:
- ADD questions to categories that have less than 10
- REMOVE questions from categories that have more than 10
- REPLACE outdated questions with recent ones
- CONTINUE until you have exactly 10 questions per category

### FINAL VALIDATION CHECKLIST:
Before submitting, confirm:
□ Total questions = 40
□ Technology questions = 10
□ Pop Culture questions = 10
□ Finance questions = 10
□ Start-Ups questions = 10
□ All questions have 4 options and 1 correct answer
□ All questions have a details field
□ All questions have a difficulty field
□ JSON array format is valid

DO NOT SUBMIT until ALL checkboxes are complete.

---

## RESPONSE FORMAT:
Return a JSON array with exactly 40 questions in this format:
```json
[
  {
    "question": "What major announcement did [Company] make recently?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Exact text of correct option",
    "details": "Brief news context or source (with date if possible)",
    "category": "Technology|Pop Culture|Finance|Start-Ups",
    "difficulty": "Easy|Medium|Hard"
  }
]
```

### CRITICAL: DOUBLE-CHECK YOUR WORK
After generating your response:
1. Count questions by category (must be exactly 10 each)
2. Verify total count (must be exactly 40)
3. Validate JSON array format
4. If anything is wrong, FIX IT before submitting
