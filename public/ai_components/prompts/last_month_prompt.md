# Enhanced AI Quiz Generation Prompt - Last Month (Last 30 Days)

## 🎯 PERPLEXITY AI SPECIFIC INSTRUCTIONS:
You are using your real-time web access to generate quiz questions about events from the LAST 30 DAYS ONLY. Use your search capabilities to find the most significant developments from the past month.

### 📅 TIME CONTEXT - CRITICAL:
- **Target Period**: ONLY the last 30 days from today
- **Search Instructions**: Use your real-time web search for events from the past month
- **Date Verification**: Every question must reference events that occurred within the last 30 days
- **Monthly Focus**: Major developments, trending stories, significant announcements from this month
- **Exclusion Rule**: Do NOT include anything older than 30 days

## 🏷️ TOPIC DEFINITIONS & BOUNDARIES:

### **Technology (exactly 10 questions)**:
- **This Month's AI/ML**: Major AI announcements, new AI tools, AI company developments
- **Software & Platforms**: This month's major software releases, platform updates, feature rollouts
- **Hardware**: This month's device launches, chip announcements, tech product releases
- **Big Tech Monthly**: Apple, Google, Microsoft, Meta, Amazon, Tesla major monthly developments
- **Cybersecurity**: This month's major security incidents, breaches, cybersecurity developments
- **Tech Industry**: This month's regulations, policy changes, executive appointments, acquisitions
- **Emerging Technologies**: This month's quantum computing, AR/VR, autonomous vehicle progress
- **EXCLUDE**: Startup funding rounds (belongs in Start-Ups)

### **Pop Culture (exactly 10 questions)**:
- **Music Monthly**: This month's major album releases, chart-toppers, music industry news
- **Entertainment**: This month's movie releases, TV premieres, streaming platform developments
- **Celebrity Culture**: This month's major celebrity news, awards, controversies, achievements
- **Social Media**: This month's viral trends, platform changes, influencer developments
- **Gaming Industry**: This month's game releases, gaming news, esports developments
- **Fashion & Culture**: This month's fashion trends, brand collaborations, cultural events
- **Digital Culture**: This month's internet phenomena, memes, online community developments
- **EXCLUDE**: Business/financial aspects of entertainment (belongs in Finance)

### **Finance (exactly 10 questions)**:
- **Market Movements**: This month's major stock movements, market trends, trading developments
- **Cryptocurrency**: This month's crypto developments, price movements, regulatory changes
- **Banking Sector**: This month's banking news, interest rate changes, financial institution news
- **Corporate Finance**: This month's earnings, mergers, acquisitions, IPO announcements
- **Economic Indicators**: This month's economic data, employment reports, inflation updates
- **Investment Trends**: This month's investment developments, fund launches, market analysis
- **Financial Policy**: This month's regulatory changes, compliance updates, policy announcements
- **EXCLUDE**: Startup funding rounds (belongs in Start-Ups)

### **Start-Ups (exactly 10 questions)**:
- **Monthly Funding**: This month's major funding rounds, Series A/B/C announcements
- **Startup Launches**: Companies that launched or went public this month
- **Unicorn Developments**: This month's unicorn announcements, major valuations, exits
- **Startup Acquisitions**: This month's acquisition announcements, merger deals
- **Entrepreneurship**: This month's founder stories, startup ecosystem developments
- **Venture Capital**: This month's VC fund announcements, investment trends, firm news
- **Innovation Breakthroughs**: This month's startup innovations, patent announcements
- **EXCLUDE**: Established tech companies (belongs in Technology)

## 🎯 CRITICAL REQUIREMENTS:

### EXACT OUTPUT REQUIREMENTS:
- You MUST provide exactly 40 questions total (not 39, not 41, exactly 40)
- You MUST provide exactly 10 questions for EACH category above
- Each question must clearly belong to its assigned category
- **ALL questions must be from the last 30 days ONLY**

### QUALITY STANDARDS:
- **Source Verification**: Each question must reference verifiable news sources from this month
- **Factual Accuracy**: Use specific numbers, dates, company names from the past 30 days
- **Monthly Significance**: Prioritize this month's most impactful developments
- **Reliable Sources**: Reuters, AP, major tech/finance publications preferred
- **Global Perspective**: Include international news from this month, not just US-centric

### DIFFICULTY DISTRIBUTION (per category):
- **Easy (3 questions)**: Major public announcements from this month
- **Medium (5 questions)**: Industry developments from this month
- **Hard (2 questions)**: Technical/specialized developments from this month

### SELF-VALIDATION PROCESS:
Before submitting your response, you MUST:

1. **COUNT CHECK**: Count your questions by category
   - Technology: ___ questions (must be 10)
   - Pop Culture: ___ questions (must be 10)
   - Finance: ___ questions (must be 10)
   - Start-Ups: ___ questions (must be 10)
   - TOTAL: ___ questions (must be 40)

2. **TIMEFRAME CHECK**: Verify each question is from LAST 30 DAYS ONLY
   - Review each question and confirm the event/news is from the last 30 days
   - Remove any questions older than 30 days
   - Add replacement questions from this month if needed

3. **CATEGORY CHECK**: Verify each question belongs to correct category
   - Does this Technology question belong in Start-Ups instead?
   - Is this Finance question actually about Pop Culture business?
   - Are the boundaries clear and respected?

4. **QUALITY CHECK**: Ensure each question has:
   - Clear, specific question text with proper grammar
   - Exactly 4 answer options (A, B, C, D)
   - One correct answer clearly marked
   - Proper category assignment
   - Verifiable information from this month only
   - A "details" field with news context and source/date from this month
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
□ Technology questions = 10 (AI, big tech, hardware, software, cybersecurity from THIS MONTH)
□ Pop Culture questions = 10 (music, movies, celebrities, social media, gaming from THIS MONTH)
□ Finance questions = 10 (stocks, crypto, banking, economics, corporate from THIS MONTH)
□ Start-Ups questions = 10 (funding, new companies, unicorns, VC from THIS MONTH)
□ ALL questions are from the last 30 days ONLY
□ All questions have 4 options and 1 correct answer
□ All questions have a "details" field with source context from this month
□ All questions have a "difficulty" field
□ JSON array format is valid
□ Information is from this month's significant developments
□ Sources are verifiable and reputable
□ No questions older than 30 days

DO NOT SUBMIT until ALL checkboxes are complete.

---

## RESPONSE FORMAT:
Return a JSON array with exactly 40 questions in this format:
```json
[
  {
    "question": "What major announcement did [Company] make this month?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": "Exact text of correct option",
    "details": "Brief news context with source and date from this month",
    "category": "Technology|Pop Culture|Finance|Start-Ups",
    "difficulty": "Easy|Medium|Hard"
  }
]
```

### CRITICAL: DOUBLE-CHECK YOUR WORK
After generating your response:
1. Count questions by category (must be exactly 10 each)
2. Verify total count (must be exactly 40)
3. Check timeframe relevance - ALL must be from LAST 30 DAYS ONLY
4. Verify category boundaries are respected
5. Validate JSON array format
6. Ensure all sources are from this month
7. If anything is wrong, FIX IT before submitting

### PERPLEXITY AI REMINDER:
Use your real-time web search to find the most significant events from the past 30 days. Focus on major developments and trending topics from THIS MONTH ONLY.