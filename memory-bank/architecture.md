# **TrendTrivia - Technical Architecture**

Version: 3.0  
Last Updated: July 20, 2025

## **1. System Overview**

TrendTrivia is a single-page application (SPA) built with React that provides an interactive quiz experience about current events and trends. The MVP1 implementation focuses on a static quiz with 5 questions covering various topics (Tech Trends, Viral Challenges, Entertainment, Fashion, Finance & Tech), implementing a complete user flow from homepage to quiz completion.

### **Core Architecture Principles**
- **Component-Based Design:** Modular React components for reusability
- **Client-Side Routing:** React Router for seamless navigation
- **Local Data Persistence:** Browser localStorage for user data and scores
- **Theme-Driven Styling:** Centralized design system with styled-components
- **Performance-Optimized:** Canvas-based animations with mobile considerations

---

## **2. Technology Stack**

### **Frontend Framework**
- **React 18.2.0** - Component-based UI library
- **Vite 5.1.6** - Fast build tool and development server
- **JavaScript (ES6+)** - Modern JavaScript features

### **Styling & Design**
- **Styled-Components 6.1.8** - CSS-in-JS for component styling
- **CSS3** - Modern CSS features including backdrop-filter
- **HTML5 Canvas** - 2D rendering for animated background

### **Routing & Navigation**
- **React Router DOM 7.6.3** - Client-side routing and navigation

### **Data Storage**
- **localStorage** - Browser-based persistence for user data
- **Static JSON** - Quiz questions stored in public/quiz.json

### **Development Tools**
- **ESLint 8.57.0** - Code linting and quality assurance
- **Jest 29.7.0** - Testing framework
- **Vite Dev Server** - Hot module replacement for development

---

## **3. Application Architecture**

### **3.1. Component Hierarchy**

```
App.jsx (Root)
├── ThemeProvider (styled-components)
├── GlobalStyles
├── Background (Canvas Animation)
└── Router
    ├── HomePage (/)
    ├── QuizPage (/quiz)
    └── ScorePage (/score)
```

### **3.2. Page Components**

#### **HomePage (`/`)**
- **Purpose:** Entry point and user data collection
- **Features:**
  - User name collection and storage
  - High score display from localStorage
  - Navigation to quiz with user data
- **State Management:** Local state for user data
- **File:** `src/pages/HomePage.jsx`

#### **QuizPage (`/quiz`)**
- **Purpose:** Interactive quiz experience
- **Features:**
  - Question display with QuizCard component
  - Answer selection and immediate feedback
  - Score tracking (10 points per correct answer)
  - Navigation controls (Home button)
  - Progress through 5 questions
- **State Management:** Quiz state, current question, score
- **File:** `src/pages/QuizPage.jsx`

#### **ScorePage (`/score`)**
- **Purpose:** Results display and completion
- **Features:**
  - Final score presentation
  - High score comparison and updates
  - Navigation options (Play Again, Home)
- **State Management:** Score data from navigation state
- **File:** `src/pages/ScorePage.jsx`

### **3.3. Shared Components**

#### **Background Component**
- **Technology:** HTML5 Canvas with 2D rendering
- **Features:**
  - Animated planets and stars
  - Mobile-responsive particle counts
  - Continuous animation loop
- **Performance:** RequestAnimationFrame for smooth animation
- **File:** `src/components/Background/index.jsx`

#### **QuizCard Component**
- **Purpose:** Reusable question display
- **Features:**
  - Glass morphism styling
  - Interactive answer options
  - Visual feedback for correct/incorrect answers
- **Props:** Question data, answer handlers, state
- **File:** `src/components/QuizCard/index.jsx`

---

## **4. Data Flow Architecture**

### **4.1. Application State Flow**

```
HomePage → QuizPage → ScorePage → HomePage
    ↓         ↓           ↓
localStorage ← Quiz Data → Navigation State
```

### **4.2. Data Persistence Strategy**

#### **localStorage Implementation**
- **User Name:** `trendtrivia-username`
- **High Score:** `trendtrivia-highscore`
- **Benefits:** No server required, instant access, persistent across sessions

#### **Static Quiz Data**
- **Location:** `public/quiz.json`
- **Format:** Array of question objects
- **Structure:**
  ```json
  [
    {
      "id": 1,
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct Option",
      "difficulty": "Easy/Medium/Hard",
      "category": "Topic Category"
    }
  ]
  ```
- **Current Content:** 5 questions covering Tech Trends, Viral Challenges, Entertainment, Fashion, and Finance & Tech

### **4.3. Navigation State Management**

#### **React Router Implementation**
- **BrowserRouter:** Enables client-side routing
- **Route Configuration:** Three main routes with element mapping
- **State Passing:** Score data passed via navigation state
- **useNavigate Hook:** Programmatic navigation between pages

---

## **5. Styling Architecture**

### **5.1. Theme System**

#### **Centralized Theme Object**
```javascript
export const theme = {
  colors: {
    primary: '#22d3ee',      // Cyan accent
    secondary: '#a5b4fc',    // Purple accent
    background: '#111827',   // Dark background
    // ... additional colors
  },
  fonts: {
    main: "'Montserrat', sans-serif"
  },
  glass: `/* Glass morphism styles */`
}
```

#### **ThemeProvider Integration**
- **Global Access:** All components access theme via props
- **Consistency:** Ensures uniform styling across application
- **Maintainability:** Single source of truth for design tokens

### **5.2. Component Styling Strategy**

#### **Styled-Components Approach**
- **Component-Scoped:** Styles encapsulated within components
- **Dynamic Styling:** Props-based conditional styling
- **Theme Integration:** Direct access to theme variables
- **Performance:** CSS-in-JS with runtime optimization

---

## **6. Performance Architecture**

### **6.1. Canvas Animation Optimization**

#### **Mobile Performance Considerations**
```javascript
const isMobile = window.innerWidth <= 768;
const planetCount = isMobile ? 4 : 8;
const starCount = isMobile ? 25 : 50;
```

#### **Animation Loop Management**
- **RequestAnimationFrame:** Browser-optimized animation timing
- **Cleanup Handling:** Proper disposal of animation loops
- **Resize Optimization:** Dynamic particle adjustment

### **6.2. Bundle Optimization**

#### **Vite Build Optimizations**
- **Tree Shaking:** Eliminates unused code
- **Code Splitting:** Automatic chunk splitting
- **Asset Optimization:** Compressed images and fonts
- **Modern JavaScript:** ES6+ with fallbacks

---

## **7. User Experience Architecture**

### **7.1. Navigation Flow**

#### **Primary User Journey**
1. **Homepage:** User enters name, views high score
2. **Quiz:** User answers 5 questions with immediate feedback
3. **Score:** User views results and high score updates
4. **Return:** User can replay or return to homepage

#### **Navigation Controls**
- **Home Buttons:** Available on Quiz and Score pages
- **Play Again:** Direct restart from Score page
- **User Data:** Name persists across sessions

### **7.2. Feedback Systems**

#### **Immediate Response**
- **Answer Feedback:** Green/red visual indicators
- **Score Updates:** Real-time score display
- **Progress Indication:** Question progression (1/5, 2/5, etc.)

#### **Achievement Recognition**
- **High Score Celebration:** Special display for new records
- **Completion Feedback:** Quiz completion acknowledgment

---

## **8. Security & Data Considerations**

### **8.1. Client-Side Security**

#### **Data Storage**
- **localStorage Only:** No sensitive data stored
- **User Preferences:** Non-sensitive user customization
- **No Authentication:** MVP1 requires no user accounts

#### **Static Assets**
- **Public Quiz Data:** Intentionally accessible
- **No API Keys:** No external service integration in MVP1

### **8.2. Privacy Considerations**
- **Minimal Data Collection:** Only username and scores
- **Local Storage:** No server-side data transmission
- **No Tracking:** No analytics or user behavior tracking

---

## **9. Current Implementation Status**

### **✅ Completed Features**
- **Full Three-Page Application:** All pages functional and styled
- **Animated Background:** Canvas-based space theme
- **Quiz Engine:** 5 questions with scoring and feedback
- **Navigation System:** Seamless routing between pages
- **High Score System:** localStorage persistence
- **Responsive Design:** Mobile-optimized layout
- **Theme System:** Complete styling architecture

### **📁 File Structure**
```
src/
├── App.jsx (Main application with routing)
├── main.jsx (Entry point)
├── components/
│   ├── Background/index.jsx (Canvas animation)
│   └── QuizCard/index.jsx (Question display)
├── pages/
│   ├── HomePage.jsx
│   ├── QuizPage.jsx
│   └── ScorePage.jsx
└── styles/
    ├── globalStyles.js
    └── theme.js
public/
└── quiz.json (5 quiz questions)
```

### **🎯 Ready for Deployment**
The application is fully functional and ready for deployment to Cloudflare Pages. All core MVP1 features have been implemented and tested.

---

## **10. Future Architecture Considerations**

### **MVP2 Enhancements**
- **Backend Integration:** Firebase Cloud Functions
- **AI Integration:** Perplexity API for dynamic content
- **Database Migration:** Firebase Firestore
- **User Authentication:** Firebase Auth
- **Dynamic Content:** Real-time quiz generation

### **Scalability Planning**
- **Component Modularity:** Ready for feature expansion
- **Theme System:** Extensible for new design requirements
- **State Management:** Prepared for complex state needs
- **Performance:** Optimized for future feature additions 