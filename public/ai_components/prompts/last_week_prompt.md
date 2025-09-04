# Enhanced AI Quiz Generation Prompt - Last Week (Last 7 Days)

## 🎯 PERPLEXITY AI SPECIFIC INSTRUCTIONS:
You are using your real-time web access to generate quiz questions about events from the LAST 7 DAYS ONLY. Use your search capabilities to find the most recent breaking news and developments.

### 📅 TIME CONTEXT - CRITICAL:
- **Target Period**: ONLY the last 7 days from today
- **Search Instructions**: Use your real-time web search for events from the past week
- **Date Verification**: Every question must reference events that occurred within the last 7 days
- **Current Focus**: Breaking news, just-announced developments, this week's trends
- **Exclusion Rule**: Do NOT include anything older than 7 days

## 🏷️ TOPIC DEFINITIONS & BOUNDARIES:

### **Technology (exactly 10 questions)**:
- **This Week's AI/ML News**: New AI tool launches, ChatGPT updates, AI company announcements
- **Software & Apps**: This week's app releases, platform updates, feature launches
- **Hardware Releases**: New device announcements, chip releases, tech product launches
- **Big Tech This Week**: Apple, Google, Microsoft, Meta, Amazon, Tesla weekly announcements
- **Cybersecurity**: This week's security breaches, patches, vulnerability discoveries
- **Tech Industry**: This week's regulations, policy changes, executive moves
- **Emerging Tech**: This week's quantum, AR/VR, autonomous vehicle developments
- **EXCLUDE**: Startup funding rounds (belongs in Start-Ups)

### **Pop Culture (exactly 10 questions)**:
- **Music This Week**: New song/album releases, chart movements, artist announcements
- **Movies & TV**: This week's releases, streaming premieres, entertainment news
- **Celebrity News**: This week's celebrity stories, relationships, controversies
- **Social Media**: This week's viral trends, platform updates, influencer news
- **Gaming**: This week's game releases, gaming industry news, esports events
- **Fashion & Lifestyle**: This week's fashion news, brand launches, cultural moments
- **Internet Culture**: This week's memes, viral content, online phenomena
- **EXCLUDE**: Business/financial aspects (belongs in Finance)

### **Finance (exactly 10 questions)**:
- **Stock Market**: This week's major market movements, earnings releases, IPO news
- **Cryptocurrency**: This week's crypto price movements, new coin launches, regulations
- **Banking**: This week's banking news, interest rate decisions, financial policy
- **Corporate News**: This week's earnings reports, mergers, acquisitions, executive changes
- **Economic Data**: This week's economic indicators, employment data, inflation reports
- **Investment News**: This week's investment trends, fund announcements, market analysis
- **Financial Regulations**: This week's new policies, compliance changes, regulatory news
- **EXCLUDE**: Startup funding rounds (belongs in Start-Ups)

### **Start-Ups (exactly 10 questions)**:
- **This Week's Funding**: Series A/B/C rounds announced this week, seed funding news
- **New Launches**: Startups that launched or went public this week
- **Unicorn News**: This week's billion-dollar valuations, successful exits
- **Acquisitions**: This week's startup acquisitions, merger announcements
- **Entrepreneurship**: This week's founder news, startup ecosystem developments
- **Venture Capital**: This week's new funds, investment announcements, VC news
- **Innovation**: This week's breakthrough innovations, patent announcements
- **EXCLUDE**: Established tech companies (belongs in Technology)

## 🎯 CRITICAL REQUIREMENTS:

### EXACT OUTPUT REQUIREMENTS:
- You MUST provide exactly 40 questions total (not 39, not 41, exactly 40)
- You MUST provide exactly 10 questions for EACH category above
- Each question must clearly belong to its assigned category
- **ALL questions must be from the last 7 days ONLY**

### QUALITY STANDARDS:
- **Source Verification**: Each question must reference verifiable news sources from this week
- **Factual Accuracy**: Use specific numbers, dates, company names from the past 7 days
- **Breaking News Focus**: Prioritize this week's most significant developments
- **Reliable Sources**: Reuters, AP, major tech/finance publications preferred
- **Global Perspective**: Include international news from this week, not just US-centric

### DIFFICULTY DISTRIBUTION (per category):
- **Easy (3 questions)**: Major public announcements from this week
- **Medium (5 questions)**: Industry developments from this week
- **Hard (2 questions)**: Technical developments from this week

### SELF-VALIDATION PROCESS:
Before submitting your response, you MUST:

1. **COUNT CHECK**: Count your questions by category
   - Technology: ___ questions (must be 10)
   - Pop Culture: ___ questions (must be 10)
   - Finance: ___ questions (must be 10)
   - Start-Ups: ___ questions (must be 10)
   - TOTAL: ___ questions (must be 40)

2. **TIMEFRAME CHECK**: Verify each question is from LAST 7 DAYS ONLY
   - Review each question and confirm the event/news is from the last 7 days
   - Remove any questions older than 7 days
   - Add replacement questions from this week if needed

3. **CATEGORY CHECK**: Verify each question belongs to correct category
   - Does this Technology question belong in Start-Ups instead?
   - Is this Finance question actually about Pop Culture business?
   - Are the boundaries clear and respected?

4. **QUALITY CHECK**: Ensure each question has:
   - Clear, specific question text with proper grammar
   - Exactly 4 answer options (A, B, C, D)
   - One correct answer clearly marked
   - Proper category assignment
   - Verifiable information from this week only
   - A "details" field with news context and source/date from this week
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
□ Technology questions = 10 (AI, big tech, hardware, software, cybersecurity from THIS WEEK)
□ Pop Culture questions = 10 (music, movies, celebrities, social media, gaming from THIS WEEK)
□ Finance questions = 10 (stocks, crypto, banking, economics, corporate from THIS WEEK)
□ Start-Ups questions = 10 (funding, new companies, unicorns, VC from THIS WEEK)
□ ALL questions are from the last 7 days ONLY
□ All questions have 4 options and 1 correct answer
□ All questions have a "details" field with source context from this week
□ All questions have a "difficulty" field
□ JSON array format is valid
□ Information is from this week's breaking news and developments
□ Sources are verifiable and reputable
□ No questions older than 7 days

DO NOT SUBMIT until ALL checkboxes are complete.

---

## RESPONSE FORMAT:
Return a JSON array with exactly 40 questions in this format:
```json
[
  {
    "question": "What major announcement did [Company] make this week?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Exact text of correct option",
    "details": "Brief news context with source and date from this week",
    "category": "Technology|Pop Culture|Finance|Start-Ups",
    "difficulty": "Easy|Medium|Hard"
  }
]
```

### CRITICAL: DOUBLE-CHECK YOUR WORK
After generating your response:
1. Count questions by category (must be exactly 10 each)
2. Verify total count (must be exactly 40)
3. Check timeframe relevance - ALL must be from LAST 7 DAYS ONLY
4. Verify category boundaries are respected
5. Validate JSON array format
6. Ensure all sources are from this week
7. If anything is wrong, FIX IT before submitting

### PERPLEXITY AI REMINDER:
Use your real-time web search to find the most current events from the past 7 days. Focus on breaking news and trending developments from THIS WEEK ONLY.