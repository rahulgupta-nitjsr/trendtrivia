# **TrendTrivia - Technical Architecture**

Version: 2.0  
Last Updated: June 27, 2024

## **1. System Overview**

TrendTrivia is a single-page application (SPA) built with React that provides an interactive quiz experience about current events. The MVP1 implementation focuses on a Finance topic with static quiz data, implementing a complete user flow from homepage to quiz completion.

### **Core Architecture Principles**
- **Component-Based Design:** Modular React components for reusability
- **Client-Side Routing:** React Router for seamless navigation
- **Local Data Persistence:** Browser localStorage for user data and scores
- **Theme-Driven Styling:** Centralized design system with styled-components
- **Performance-Optimized:** Canvas-based animations with mobile considerations
- **Living Documentation:** Continuous updates to project documentation and Notion database
- **Modular Development Philosophy:** Preference for building reusable, maintainable components and systems

---

## **2. Technology Stack**

### **Frontend Framework**
- **React 18.2.0** - Component-based UI library
- **Vite 5.4.19** - Fast build tool and development server
- **JavaScript (ES6+)** - Modern JavaScript features

### **Styling & Design**
- **Styled-Components 6.1.8** - CSS-in-JS for component styling
- **CSS3** - Modern CSS features including backdrop-filter
- **HTML5 Canvas** - 2D rendering for animated background

### **Routing & Navigation**
- **React Router DOM** - Client-side routing and navigation

### **Data Storage**
- **localStorage** - Browser-based persistence for user data
- **Static JSON** - Quiz questions stored in public/quiz.json

### **Development Tools**
- **ESLint** - Code linting and quality assurance
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

**Modular Design Philosophy:** Each component is designed to be reusable and maintainable, following the developer's preference for modular architecture.

### **3.2. Page Components**

#### **HomePage (`/`)**
- **Purpose:** Entry point and topic selection
- **Features:**
  - User name collection and storage
  - Topic selection interface (Finance active)
  - High score display
  - Navigation to quiz
- **State Management:** Local state for user data

#### **QuizPage (`/quiz`)**
- **Purpose:** Interactive quiz experience
- **Features:**
  - Question display with QuizCard component
  - Answer selection and immediate feedback
  - Score tracking
  - Navigation controls (Home button)
- **State Management:** Quiz state, current question, score

#### **ScorePage (`/score`)**
- **Purpose:** Results display and completion
- **Features:**
  - Final score presentation
  - High score comparison and updates
  - Navigation options (Play Again, Home)
- **State Management:** Score data from navigation state

### **3.3. Shared Components**

#### **Background Component**
- **Technology:** HTML5 Canvas with 2D rendering
- **Features:**
  - Animated planets and stars
  - Mobile-responsive particle counts
  - Continuous animation loop
- **Performance:** RequestAnimationFrame for smooth animation

#### **QuizCard Component**
- **Purpose:** Reusable question display
- **Features:**
  - Glass morphism styling
  - Interactive answer options
  - Visual feedback for correct/incorrect answers
- **Props:** Question data, answer handlers, state

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
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct Option"
    }
  ]
  ```

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
1. **Homepage:** User enters name, selects Finance topic
2. **Quiz:** User answers questions with immediate feedback
3. **Score:** User views results and high score updates
4. **Return:** User can replay or return to homepage

#### **Navigation Controls**
- **Home Buttons:** Available on Quiz and Score pages
- **Play Again:** Direct restart from Score page
- **Topic Selection:** Return to homepage for new topic

### **7.2. Feedback Systems**

#### **Immediate Response**
- **Answer Feedback:** Green/red visual indicators
- **Score Updates:** Real-time score display
- **Progress Indication:** Question progression

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

#### **Data Collection**
- **Minimal Collection:** Only user name and scores
- **Local Storage:** No data transmitted to servers
- **User Control:** Easy to clear via browser settings

---

## **9. Deployment Architecture**

### **9.1. Build Process**

#### **Vite Production Build**
```bash
npm run build
# Generates optimized static files in /dist
```

#### **Static Site Deployment**
- **Target Platform:** Cloudflare Pages (planned)
- **Build Output:** Static HTML, CSS, JS files
- **CDN Distribution:** Global content delivery

### **9.2. Development Workflow**

#### **Local Development**
```bash
npm run dev
# Starts Vite dev server with HMR
```

#### **Development Features**
- **Hot Module Replacement:** Instant updates during development
- **Source Maps:** Debugging support
- **Fast Refresh:** React state preservation during updates

---

## **10. Future Architecture Considerations**

### **10.1. MVP2 Enhancements**

#### **Backend Integration**
- **API Layer:** Real-time quiz generation
- **Database:** User accounts and persistent data
- **Authentication:** Secure user management

#### **State Management**
- **Context API:** Global state management
- **React Query:** Server state synchronization

### **10.2. Scalability Preparations**

#### **Component Architecture**
- **Atomic Design:** Further component breakdown following modular principles
- **Custom Hooks:** Reusable logic extraction for maintainability
- **Error Boundaries:** Robust error handling with modular approach
- **Modular Systems:** Preference for building systems that can be easily extended and reused

#### **Performance Monitoring**
- **Web Vitals:** Core performance metrics
- **Analytics Integration:** User behavior tracking
- **Progressive Enhancement:** Graceful feature degradation

---

## **11. Documentation Architecture**

### **11.1. Documentation Strategy**

#### **Multi-Level Documentation Approach**
- **Project-Level:** Notion Projects database for high-level tracking
- **Technical-Level:** Architecture and design documents in `memory-bank/`
- **Code-Level:** Inline comments and component documentation
- **Progress-Level:** Real-time progress tracking and milestone updates

#### **Documentation Update Workflow**
1. **Code Changes:** Update relevant documentation immediately
2. **Feature Completion:** Update progress tracker and Notion database
3. **Architecture Changes:** Update architecture.md and design documents
4. **Version Control:** Commit documentation changes with code changes

### **11.2. Notion Integration**

#### **Projects Database Structure**
- **Project Tracking:** Centralized project management
- **Progress Monitoring:** Real-time status updates
- **Documentation Hub:** Comprehensive project details
- **Version History:** Track project evolution over time

#### **Update Triggers**
- **Major Features:** Update project status and progress
- **Technical Changes:** Update architecture and design documents
- **Milestone Completion:** Update progress tracker and Notion entry
- **Bug Fixes:** Document significant fixes and improvements

### **11.3. Living Documentation Standards**

#### **Real-Time Updates**
- **Immediate Updates:** Documentation changes with code changes
- **Version Synchronization:** Documentation version matches code version
- **Cross-Reference:** Links between Notion and local documentation
- **Consistency Checks:** Regular verification of documentation accuracy

#### **Quality Assurance**
- **Accuracy:** Documentation reflects actual implementation
- **Completeness:** All major features and decisions documented
- **Accessibility:** Clear, searchable documentation structure
- **Maintenance:** Regular review and cleanup of outdated information

---

This architecture provides a solid foundation for TrendTrivia's current implementation while maintaining flexibility for future enhancements and scalability requirements. The documentation strategy ensures that project knowledge is preserved and accessible throughout development. 