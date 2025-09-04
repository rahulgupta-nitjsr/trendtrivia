# Enhanced AI Quiz Generation Prompt - Default (Recent Trends)

## 🎯 PERPLEXITY AI SPECIFIC INSTRUCTIONS:
You are using your real-time web access to generate current, factual quiz questions. Use your search capabilities to find the most recent and trending information.

### 📅 TIME CONTEXT:
- Target Period: Recent trends and developments (last few months)
- Use your real-time web search to find current information
- Prioritize trending topics and recent major developments
- Verify all information is current and factual

## 🏷️ TOPIC DEFINITIONS & BOUNDARIES:

### **Technology (exactly 10 questions)**:
- AI/ML developments, ChatGPT updates, new AI tools
- Software releases, app launches, platform updates
- Hardware launches (iPhone, Android, chips, processors)
- Big Tech announcements (Apple, Google, Microsoft, Meta, Amazon, Tesla)
- Cybersecurity incidents, data breaches, privacy updates
- Tech industry regulations, antitrust cases, policy changes
- Emerging tech (quantum computing, AR/VR, autonomous vehicles)
- **EXCLUDE**: Startup funding rounds (belongs in Start-Ups)

### **Pop Culture (exactly 10 questions)**:
- Music: New album releases, artist collaborations, chart toppers
- Movies & TV: New releases, streaming hits, award shows
- Celebrity news: Relationships, controversies, achievements
- Social media trends: Viral content, platform updates, influencer news
- Gaming: New game releases, esports events, gaming industry news
- Fashion & lifestyle: Trends, brand collaborations, cultural moments
- Internet culture: Memes, viral phenomena, online communities
- **EXCLUDE**: Business/financial aspects (belongs in Finance)

### **Finance (exactly 10 questions)**:
- Stock market: Major movements, record highs/lows, market trends
- Cryptocurrency: Bitcoin/Ethereum prices, new coins, regulations
- Banking: Interest rates, policy changes, major bank news
- Corporate: Earnings reports, mergers, acquisitions, IPOs
- Economic indicators: Inflation, employment, GDP data
- Investment trends: ESG investing, market sectors, fund movements
- Financial regulations: New policies, compliance changes
- **EXCLUDE**: Startup funding rounds (belongs in Start-Ups)

### **Start-Ups (exactly 10 questions)**:
- Funding rounds: Series A/B/C, seed funding, venture capital
- New startup launches: Innovative companies, disruptive ideas
- Unicorn news: Billion-dollar valuations, successful exits
- Startup acquisitions: Who bought whom, exit strategies
- Entrepreneurship: Founder stories, startup ecosystem news
- Venture capital: New funds, investment trends, VC firm news
- Innovation hubs: Silicon Valley, global startup scenes
- **EXCLUDE**: Established tech companies (belongs in Technology)

## 🎯 CRITICAL REQUIREMENTS:

### EXACT OUTPUT REQUIREMENTS:
- You MUST provide exactly 40 questions total (not 39, not 41, exactly 40)
- You MUST provide exactly 10 questions for EACH category above
- Each question must clearly belong to its assigned category

### QUALITY STANDARDS:
- **Source Verification**: Each question must reference verifiable news sources
- **Factual Accuracy**: Use specific numbers, dates, company names
- **Current Information**: Prioritize recent developments and trending topics
- **Reliable Sources**: Reuters, AP, major tech/finance publications preferred
- **Global Perspective**: Include international news, not just US-centric

### DIFFICULTY DISTRIBUTION (per category):
- **Easy (3 questions)**: Well-known companies, major public announcements
- **Medium (5 questions)**: Industry-specific knowledge, recent developments
- **Hard (2 questions)**: Detailed technical knowledge, niche developments

### SELF-VALIDATION PROCESS:
Before submitting your response, you MUST:

1. **COUNT CHECK**: Count your questions by category
   - Technology: ___ questions (must be 10)
   - Pop Culture: ___ questions (must be 10)
   - Finance: ___ questions (must be 10)
   - Start-Ups: ___ questions (must be 10)
   - TOTAL: ___ questions (must be 40)

2. **CATEGORY CHECK**: Verify each question belongs to correct category
   - Does this Technology question belong in Start-Ups instead?
   - Is this Finance question actually about Pop Culture business?
   - Are the boundaries clear and respected?

3. **QUALITY CHECK**: Ensure each question has:
   - Clear, specific question text with proper grammar
   - Exactly 4 answer options (A, B, C, D)
   - One correct answer clearly marked
   - Proper category assignment
   - Recent, verifiable information
   - A "details" field with news context and source/date
   - A "difficulty" field (Easy, Medium, Hard)

### ERROR CORRECTION INSTRUCTIONS:
If your count is wrong:
- ADD questions to categories that have less than 10
- REMOVE questions from categories that have more than 10
- REPLACE outdated questions with recent, trending ones
- CONTINUE until you have exactly 10 questions per category

### FINAL VALIDATION CHECKLIST:
Before submitting, confirm:
□ Total questions = 40
□ Technology questions = 10 (AI, big tech, hardware, software, cybersecurity)
□ Pop Culture questions = 10 (music, movies, celebrities, social media, gaming)
□ Finance questions = 10 (stocks, crypto, banking, economics, corporate)
□ Start-Ups questions = 10 (funding, new companies, unicorns, VC, entrepreneurship)
□ All questions have 4 options and 1 correct answer
□ All questions have a "details" field with source context
□ All questions have a "difficulty" field
□ JSON array format is valid
□ Information is current and trending
□ Sources are verifiable and reputable

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
