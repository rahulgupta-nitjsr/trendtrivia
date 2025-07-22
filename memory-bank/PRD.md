# **TrendTrivia - Comprehensive Product Requirements Document**

Version: 3.0  
Last Updated: July 20, 2025

## **1. Introduction & Overview**

### **1.1. Document Purpose**

This document outlines the overall product vision, goals, target audience, features, and phased development plan for TrendTrivia. It serves as a strategic guide for building an engaging, AI-powered news quiz application.

### **1.2. Product Name**

TrendTrivia

### **1.3. Product Vision**

To be the go-to platform for individuals seeking a fun, engaging, and informative way to stay updated with and test their knowledge on current events and trends across various domains, powered by intelligent content generation.

### **1.4. Core Problem/Opportunity**

Staying informed about rapidly changing news and trends can be time-consuming and often passive. Traditional news consumption lacks engagement and a way to actively test understanding. TrendTrivia aims to transform this by gamifying news consumption, making learning active, enjoyable, and rewarding.

### **1.5. Overall Product Goals (User-centric)**

* **Inform & Educate:** Provide users with a dynamic way to learn about and recall key information from recent news and happenings.  
* **Engage & Entertain:** Offer an enjoyable and interactive quiz experience that motivates users to return and test their knowledge regularly.  
* **Empower Knowledge:** Help users feel more informed and confident about their understanding of current events in topics they care about.  
* **Personalize (Future):** Allow users to tailor their quiz experience to their interests and track their progress over time.

### **1.6. Target Audience**

* Individuals interested in a fun, quick, and accessible way to stay updated and test their knowledge on current news and trends across various topics (e.g., Finance, Technology, Startups, Entertainment).  
* Lifelong learners and trivia enthusiasts.

## **2. Guiding Principles**

* **User-Centric Design:** Prioritize a simple, intuitive, and enjoyable experience for the end-user.  
* **AI-Powered Innovation:** Leverage AI to create relevant, timely, and diverse quiz content.  
* **Iterative Development (Start Small, Grow Smart):** Begin with a focused MVP and incrementally add value based on learning and user feedback.  
* **Quality Content:** Strive for accuracy and relevance in quiz questions and contextual information.  
* **Accessibility:** Design for a broad audience, considering accessibility standards.  
* **(Developer Context) Practical, Real-World Learning:** Focus on applying concepts in a way that mirrors real product development.  
* **(Developer Context) Free & Open Source First:** Prioritize free tiers, open-source software, and low-cost solutions for development and deployment, especially in early stages.  
* **(Developer Context) Keep it Simple (KISS):** Avoid unnecessary complexity, especially in initial phases.
* **(Developer Context) Modular Development:** Preference for building reusable, maintainable components and systems that can be easily extended and modified.

## **3. Product Roadmap & Phased Releases**

This roadmap outlines a phased approach to developing TrendTrivia, starting with a foundational MVP and progressively adding features and capabilities.

### **3.1. Phase 1: MVP1 - Foundation & Core Quiz Experience - COMPLETED**

* **3.1.1. Goals for MVP1:**  
  *   Finalize the user interface and experience through visual mockups.
  *   Validate the core quiz concept with a simple, static set of questions.
  *   Establish the foundational technical architecture for the web app.
  *   Deliver a simple, playable quiz experience with immediate feedback.
* **3.1.2. Design Phase: Wireframes & Mockups - COMPLETED**
  *   **✅ Wireframes:** User provided comprehensive wireframes in PDF format showing three main screens:
    - **Homepage (Diagram 2):** Welcome message, user name collection, high score display
    - **Quiz Page (Diagram 3):** Question display, answer options, score tracking
    - **Score Page:** Final results, high score celebration, navigation options
  *   **✅ Design Implementation:** Applied space-themed design system with:
    - **Reference Analysis:** Used provided index.html as design foundation
    - **Color Palette:** Primary cyan (#22d3ee), secondary purple (#a5b4fc), dark background (#111827)
    - **Typography:** Montserrat font family for modern, readable interface
    - **Glass Morphism:** Translucent effects with backdrop-filter and rgba backgrounds
    - **Animated Background:** 2D Canvas particle system with planets and stars
* **3.1.3. Key Features for MVP1 - COMPLETED:**  
  * **✅ Multi-Topic Content:** 5 questions covering various topics (Tech Trends, Viral Challenges, Entertainment, Fashion, Finance & Tech).
  * **✅ Pre-Generated Content:**
    *   Static set of 5 multiple-choice questions stored in `public/quiz.json`.
    *   Questions cover diverse topics including social media trends, viral challenges, streaming services, fashion trends, and cryptocurrency.
    *   The live MVP1 application reads from this local JSON file without external API calls.
  * **✅ Quiz Interface:**  
    *   Clean, space-themed UI displaying one question at a time with QuizCard component.
    *   Interactive answer selection with hover effects and glass morphism styling.
    *   Home button for navigation back to homepage.
    *   Progress indication (1/5, 2/5, etc.).
  * **✅ Gamification:**
    *   Real-time scoring based on correct answers (10 points per correct answer).
    *   Immediate visual feedback: Green background for correct answers, red for incorrect.
    *   Final score display on dedicated Score page with celebration messaging.
  * **✅ High Score Tracking:**  
    *   Persistent storage using localStorage (upgraded from cookies for better reliability).
    *   High score comparison and celebration when new records are achieved.
    *   High score display on homepage for motivation.
  * **✅ Complete UI Flow:** 
    *   **Homepage:** User name collection, high score display, navigation to quiz
    *   **Quiz Page:** Question progression with immediate feedback and navigation
    *   **Score Page:** Final results, high score updates, replay functionality  
* **3.1.4. Success Metrics for MVP1 - ACHIEVED:**  
  * ✅ Application successfully runs on local development server (http://localhost:5173/).
  * ✅ Users can complete the static 5-question quiz covering multiple topics.
  * ✅ Answer feedback (green/red visual indicators) works as expected.
  * ✅ High score functionality works as expected with localStorage persistence.
  * ✅ Complete user flow from homepage → quiz → score → homepage implemented.
  * ✅ Responsive design works across desktop and mobile devices.
  * ✅ Animated background with space theme and glass morphism effects.
  * **Pending:** Deployment to public URL (ready for Cloudflare Pages deployment).
* **3.1.5. Developer Learning Focus:**
  *   **UI/UX Design Concepts:** You will learn the difference between Wireframes (blueprints) and Mockups (realistic visuals) and understand how they guide the development process. This is the foundation of User Interface (UI) and User Experience (UX) design.
  *   **Frontend Basics (React):** You will learn how to build the user-facing part of a website using React. Think of this as learning how to build with interactive digital LEGO bricks.
  *   **Modular Component Architecture:** You will learn to build reusable, maintainable components following modular development principles - creating systems that can be easily extended and modified.
  *   **Application State:** You'll learn the fundamental concept of "state" – how an application remembers things like the current question number or the user's score.
  *   **Data Handling (JSON):** You will learn how to structure data in a JSON file, which is like a simple, readable phonebook for our app's information, and how to load that data into the application.
  *   **Basic Deployment:** You will learn how to take the application from your local computer and publish it to the internet for the world to see using Cloudflare Pages.

### **3.2. Phase 2: MVP2 - Dynamic Content & User Choice**

* **3.2.1. Goals for MVP2:**  
  * Introduce content diversity by allowing users to select their quiz topic.
  * Implement a backend to dynamically generate quizzes in real-time.
  * Introduce basic user accounts for persistent score tracking.
* **3.2.2. Key Features for MVP2:**  
  * **User-Selected Topics:**
    *   Introduce a UI for users to choose from a list of topics (e.g., "Finance," "Business," "Latest News").
  * **Live AI-Powered Quiz Generation:**
    *   Upon user selection, the backend makes a **real-time API call** to Perplexity.
    *   The API is prompted to generate a fresh quiz based on the latest news for the chosen topic.
    *   The backend processes the response and sends a ready-to-play quiz to the web app.
  * **Backend for Frontend (BFF) Architecture:**
    *   All communication with the Perplexity API is handled securely by the backend (Firebase Cloud Functions). No API keys are exposed to the browser.
  * **Database Integration:**
    *   Migrate from a static JSON file to a scalable, free-tier cloud database (e.g., Firebase Firestore) to support user accounts and score persistence.
  * **Basic User Accounts:**  
    *   Simple registration and login (e.g., email/password).  
    *   Persistent storage of user scores across sessions and devices.  
  * **UI/UX Improvements:** Based on feedback from MVP1.
* **3.2.3. Success Metrics for MVP2:**  
  * Users can successfully select a topic and play a dynamically generated quiz.
  * The backend successfully communicates with the Perplexity API in real-time.
  * Users can create accounts and have their scores saved persistently.
  * An increase in user engagement (e.g., number of quizzes played).
* **3.2.4. Developer Learning Focus:**
  *   **Backend Development (Serverless):** You will learn what a "backend" is (the engine room of your app) and how to build one using serverless functions, which are like hiring a specialist who only shows up (and gets paid) for the exact moment you need them.
  *   **API Security:** You will learn the critical importance of keeping secrets (like your Perplexity API key) safe on the backend, and never exposing them to the user's browser.
  *   **Database Fundamentals (NoSQL):** You will learn what a real database is and how to use Firestore to permanently store information, like user accounts and high scores, in a way that's fast and scalable.
  *   **User Authentication:** You will learn how to build a secure "gatekeeper" for your app, allowing users to sign up and log in safely.
  *   **Full-Stack Integration:** You will see the full picture of how the frontend (your website), backend (the engine), and database (the memory) all talk to each other to create a complete, dynamic application.

### **3.3. Future Vision (Beyond MVP2)**

* **3.3.1. Potential Future Features & Capabilities:**  
  * **Advanced Gamification:**  
    * Global and friend-based leaderboards.  
    * Badges, achievements, and points systems.  
    * Daily challenges or streaks.  
  * **Personalization:**  
    * User profiles with preferences.  
    * Quiz recommendations based on interests or performance.  
    * Personalized learning paths or feedback.  
  * **Content Expansion:**  
    * Wider range of topics (e.g., Entertainment, Science, World News).  
    * Different question types (e.g., true/false, fill-in-the-blanks, image-based questions if relevant).  
    * User-contributed questions (with moderation).  
  * **Community Features:**  
    * Ability to challenge friends.  
    * Discussion forums or comments related to quiz topics.  
  * **Advanced AI & Analytics:**  
    * AI to dynamically adjust quiz difficulty.  
    * Deeper analysis of news content for more nuanced questions.  
    * Analytics on user performance to provide insights.  
  * **Monetization (Optional & Long-term):**  
    * Premium features (e.g., ad-free experience, exclusive content).  
    * Sponsorships for specific topic quizzes.  
  * **Mobile Applications:** Native iOS and Android apps for an optimized mobile experience.  
  * **Admin Dashboard:** Tools for content management, user management, and analytics.

## **4. Detailed Feature Specifications (Current Implementation)**

### **4.1. Core Quiz Engine - IMPLEMENTED**

* **Functionality:** Handles question fetching, display logic, answer processing, scoring, and progression through the quiz.  
* **Key Aspects:** 
  * Static question loading from JSON file
  * Clear presentation of questions and options
  * Immediate feedback mechanisms
  * Score calculation (10 points per correct answer)
  * Progress tracking through 5 questions

### **4.2. User Interface Components - IMPLEMENTED**

* **HomePage:** User name collection, high score display, navigation to quiz
* **QuizPage:** Question display, answer selection, score tracking, navigation
* **ScorePage:** Final results, high score updates, replay functionality
* **Background:** Animated space theme with planets and stars
* **QuizCard:** Reusable question display component

### **4.3. Gamification Elements - IMPLEMENTED**

* **Functionality:** Features designed to increase user engagement and enjoyment.  
* **Current Implementation:**
  * Real-time scoring with immediate feedback
  * High score tracking with localStorage persistence
  * Visual feedback for correct/incorrect answers
  * Progress indication through quiz
  * Celebration messaging for new high scores

### **4.4. User Interface & Experience (UI/UX) - IMPLEMENTED**

* **Principles:** Clean, intuitive, responsive, and visually appealing.  
* **Key Components:** 
  * Landing page with user name collection
  * Quiz interface with glass morphism effects
  * Score display with high score celebration
  * Responsive design for mobile and desktop
  * Animated background with space theme

### **4.5. Data Management - IMPLEMENTED**

* **Static Content:** 5 quiz questions stored in `public/quiz.json`
* **User Data:** Names and high scores stored in localStorage
* **No Server Required:** MVP1 operates entirely client-side

### **4.6. Future Features (MVP2+)**

* **User Account Management:** Registration, login, profile management
* **Dynamic Content Generation:** AI-powered quiz creation
* **Topic Selection:** User choice of quiz categories
* **Backend Integration:** Firebase Cloud Functions and Firestore

## **5. AI Integration Strategy**

### **5.1. MVP1 Approach - COMPLETED**

* Focus on validating the core concept with manually created questions covering diverse topics.  
* Prioritize simplicity and feasibility with static content.
* Store questions in a local JSON file for immediate access.

### **5.2. Evolution & Scalability (Post-MVP1)**

* Integrate news APIs for automated content sourcing across multiple topics.
* Develop more sophisticated prompt engineering techniques for higher quality and variety of questions.
* Implement a robust pipeline for regular (e.g., daily) updates to a database-backed question bank.
* Explore different LLMs or fine-tuning (if feasible and cost-effective in later stages) for specialized content generation.
* Monitor AI model performance and implement mechanisms for quality control.

## **6. Technology Stack Considerations (Current & Evolving)**

The specific technologies have been chosen based on the guiding principles, particularly focusing on free tiers, open-source options, and learning value. The current stack is fully implemented and ready for MVP2 enhancements.

* **Frontend:** ✅ React 18.2.0 with Vite 5.1.6
* **Styling:** ✅ Styled-components 6.1.8
* **Routing:** ✅ React Router DOM 7.6.3
* **Data Storage:** ✅ Static JSON + localStorage
* **Testing:** ✅ Jest 29.7.0 + React Testing Library
* **Deployment:** Cloudflare Pages (planned)
* **Future Backend:** Firebase Cloud Functions + Firestore
* **Future AI:** Perplexity API integration

## **7. Current Implementation Status**

### **✅ Completed Features**
- **Full Three-Page Application:** Homepage, Quiz, and Score pages
- **Animated Background:** Canvas-based space theme
- **Quiz Engine:** 5 questions with scoring and feedback
- **Navigation System:** Seamless routing between pages
- **High Score System:** localStorage persistence
- **Responsive Design:** Mobile-optimized layout
- **Theme System:** Complete styling architecture
- **Glass Morphism UI:** Modern visual effects

### **🎯 Ready for Deployment**
The application is fully functional and ready for deployment to Cloudflare Pages. All core MVP1 features have been implemented and tested.

### **📋 Next Steps**
1. **Deploy to Cloudflare Pages:** Set up deployment pipeline
2. **Domain Configuration:** Configure aiproductpm.com/trendtrivia
3. **MVP2 Planning:** Begin backend integration and AI features