# Enhanced AI Quiz Generation Prompt - Last Year (Last 365 Days)

## 🎯 PERPLEXITY AI SPECIFIC INSTRUCTIONS:
You are using your real-time web access to generate quiz questions about the most significant events from the LAST 365 DAYS ONLY. Use your search capabilities to find the most impactful developments from the past year.

### 📅 TIME CONTEXT - CRITICAL:
- **Target Period**: ONLY the last 365 days from today (past year)
- **Search Instructions**: Use your real-time web search for major events from the past year
- **Date Verification**: Every question must reference events that occurred within the last 365 days
- **Annual Focus**: Most significant developments, major milestones, year-defining moments
- **Exclusion Rule**: Do NOT include anything older than 365 days

## 🏷️ TOPIC DEFINITIONS & BOUNDARIES:

### **Technology (exactly 10 questions)**:
- **AI Revolution**: This year's major AI breakthroughs, ChatGPT developments, AI company milestones
- **Software Evolution**: This year's major software releases, platform transformations, feature launches
- **Hardware Innovation**: This year's device launches, chip breakthroughs, tech product innovations
- **Big Tech Movements**: Apple, Google, Microsoft, Meta, Amazon, Tesla major yearly developments
- **Cybersecurity Events**: This year's major security incidents, breaches, cybersecurity milestones
- **Tech Industry Shifts**: This year's regulations, policy changes, major acquisitions, leadership changes
- **Emerging Tech Progress**: This year's quantum computing, AR/VR, autonomous vehicle achievements
- **EXCLUDE**: Startup funding rounds (belongs in Start-Ups)

### **Pop Culture (exactly 10 questions)**:
- **Music Year**: This year's biggest album releases, chart-dominators, music industry changes
- **Entertainment Highlights**: This year's blockbuster movies, hit TV shows, streaming milestones
- **Celebrity Moments**: This year's major celebrity stories, awards, cultural impact moments
- **Social Media Evolution**: This year's platform changes, viral phenomena, influencer milestones
- **Gaming Milestones**: This year's major game releases, gaming industry developments, esports growth
- **Cultural Movements**: This year's fashion trends, brand collaborations, cultural phenomena
- **Digital Culture**: This year's internet culture evolution, meme culture, online community growth
- **EXCLUDE**: Business/financial aspects of entertainment (belongs in Finance)

### **Finance (exactly 10 questions)**:
- **Market Milestones**: This year's major market movements, record highs/lows, trading developments
- **Crypto Evolution**: This year's cryptocurrency developments, major price movements, regulatory changes
- **Banking Transformation**: This year's banking industry changes, interest rate impacts, financial innovations
- **Corporate Highlights**: This year's major earnings, significant mergers, notable IPOs, corporate milestones
- **Economic Indicators**: This year's economic developments, employment trends, inflation impacts
- **Investment Evolution**: This year's investment trends, fund developments, market transformations
- **Financial Regulation**: This year's major regulatory changes, compliance developments, policy impacts
- **EXCLUDE**: Startup funding rounds (belongs in Start-Ups)

### **Start-Ups (exactly 10 questions)**:
- **Funding Milestones**: This year's major funding rounds, record-breaking investments, Series milestones
- **Startup Success**: Companies that launched, went public, or achieved major milestones this year
- **Unicorn Achievements**: This year's new unicorns, major valuations, successful exits
- **Acquisition Highlights**: This year's major startup acquisitions, strategic mergers
- **Entrepreneurship Growth**: This year's founder successes, startup ecosystem developments
- **VC Evolution**: This year's venture capital developments, new funds, investment trend shifts
- **Innovation Breakthroughs**: This year's startup innovations, disruptive technologies, patent milestones
- **EXCLUDE**: Established tech companies (belongs in Technology)

## 🎯 CRITICAL REQUIREMENTS:

### EXACT OUTPUT REQUIREMENTS:
- You MUST provide exactly 40 questions total (not 39, not 41, exactly 40)
- You MUST provide exactly 10 questions for EACH category above
- Each question must clearly belong to its assigned category
- **ALL questions must be from the last 365 days ONLY**

### QUALITY STANDARDS:
- **Source Verification**: Each question must reference verifiable news sources from this year
- **Factual Accuracy**: Use specific numbers, dates, company names from the past 365 days
- **Annual Significance**: Prioritize this year's most defining and impactful developments
- **Reliable Sources**: Reuters, AP, major tech/finance publications preferred
- **Global Perspective**: Include international news from this year, not just US-centric

### DIFFICULTY DISTRIBUTION (per category):
- **Easy (3 questions)**: Major public milestones from this year
- **Medium (5 questions)**: Industry developments from this year
- **Hard (2 questions)**: Technical/specialized achievements from this year

### SELF-VALIDATION PROCESS:
Before submitting your response, you MUST:

1. **COUNT CHECK**: Count your questions by category
   - Technology: ___ questions (must be 10)
   - Pop Culture: ___ questions (must be 10)
   - Finance: ___ questions (must be 10)
   - Start-Ups: ___ questions (must be 10)
   - TOTAL: ___ questions (must be 40)

2. **TIMEFRAME CHECK**: Verify each question is from LAST 365 DAYS ONLY
   - Review each question and confirm the event/news is from the last 365 days
   - Remove any questions older than 365 days
   - Add replacement questions from this year if needed

3. **CATEGORY CHECK**: Verify each question belongs to correct category
   - Does this Technology question belong in Start-Ups instead?
   - Is this Finance question actually about Pop Culture business?
   - Are the boundaries clear and respected?

4. **QUALITY CHECK**: Ensure each question has:
   - Clear, specific question text with proper grammar
   - Exactly 4 answer options (A, B, C, D)
   - One correct answer clearly marked
   - Proper category assignment
   - Verifiable information from this year only
   - A "details" field with news context and source/date from this year
   - A "difficulty" field (Easy, Medium, Hard)

### ERROR CORRECTION INSTRUCTIONS:
If your count is wrong:
- ADD questions to categories that have less than 10
- REMOVE questions from categories that have more than 10
- REPLACE outdated questions with recent ones from the correct timeframe
- CONTINUE until you have exactly 10 questions per category

### FINAL VALIDATION CHECKLIST:
Before submitting, confirm:
□ Total questions = 40
□ Technology questions = 10 (AI, big tech, hardware, software, cybersecurity from THIS YEAR)
□ Pop Culture questions = 10 (music, movies, celebrities, social media, gaming from THIS YEAR)
□ Finance questions = 10 (stocks, crypto, banking, economics, corporate from THIS YEAR)
□ Start-Ups questions = 10 (funding, new companies, unicorns, VC from THIS YEAR)
□ ALL questions are from the last 365 days ONLY
□ All questions have 4 options and 1 correct answer
□ All questions have a "details" field with source context from this year
□ All questions have a "difficulty" field
□ JSON array format is valid
□ Information is from this year's most significant developments
□ Sources are verifiable and reputable
□ No questions older than 365 days

DO NOT SUBMIT until ALL checkboxes are complete.

---

## RESPONSE FORMAT:
Return a JSON array with exactly 40 questions in this format:
```json
[
  {
    "question": "What major announcement did [Company] make this year?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Exact text of correct option",
    "details": "Brief news context with source and date from this year",
    "category": "Technology|Pop Culture|Finance|Start-Ups",
    "difficulty": "Easy|Medium|Hard"
  }
]
```

### CRITICAL: DOUBLE-CHECK YOUR WORK
After generating your response:
1. Count questions by category (must be exactly 10 each)
2. Verify total count (must be exactly 40)
3. Check timeframe relevance - ALL must be from LAST 365 DAYS ONLY
4. Verify category boundaries are respected
5. Validate JSON array format
6. Ensure all sources are from this year
7. If anything is wrong, FIX IT before submitting

### PERPLEXITY AI REMINDER:
Use your real-time web search to find the most significant and defining events from the past 365 days. Focus on year-defining milestones and major developments from THIS YEAR ONLY.