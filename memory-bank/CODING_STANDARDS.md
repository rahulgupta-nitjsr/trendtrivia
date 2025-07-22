# **TrendTrivia - Coding Standards & Development Guidelines**

Version: 3.0  
Last Updated: July 20, 2025

This document outlines the official standards and best practices for all development within the TrendTrivia project. Adherence to these guidelines is mandatory to ensure the codebase is modular, readable, robust, and secure.

## **1. Core Philosophy**

These are the six foundational rules that guide every decision.

1.  **Modularity Over Monoliths:** We will always favor breaking down features into small, reusable components and functions. Each file must have a single, clear purpose. This prevents "god files" that are hard to read, test, and maintain.
2.  **Clarity Through Comments:** Code should be accompanied by clear comments that explain the "why" behind the logic, not just the "what." This is crucial for complex business rules, non-obvious workarounds, or important decisions.
3.  **Iterative & Simple Development:** We will make changes in small, logical, and reviewable steps. We will always aim for the simplest, most robust solution that meets the requirements, avoiding premature optimization or unnecessary complexity.
4.  **Security First:** The application's security is paramount. API keys, secrets, or any sensitive information must **never** be exposed on the frontend. All sensitive operations must be handled by a secure backend service.
5.  **Robustness and Error Handling:** The application must be reliable. This means anticipating potential issues and handling errors gracefully (e.g., what happens if an API call fails?).
6.  **Living Documentation:** The project's documentation is as important as the code. The `progress.md`, `architecture.md`, and Notion project database must be updated continuously to reflect the current state of the project.
7.  **Modular Development Preference:** The developer prefers building modular, reusable components and systems. Every feature should be designed with reusability and maintainability in mind, following the principle of "build once, use everywhere."

## **2. File & Folder Structure**

To enforce modularity, we will follow a strict directory structure.

*   **`src/components/`**: This is where all reusable React components will live. Each component will be in its own PascalCase folder (e.g., `src/components/QuizButton/`).
*   **`src/pages/`**: These are the top-level components for each page or view of the application (e.g., `HomePage`, `QuizPage`).
*   **`src/hooks/`**: For custom, reusable React Hooks (e.g., `useQuizState`).
*   **`src/services/`**: For functions that handle communication with external APIs. For MVP1, this will be minimal, but the structure will be in place.
*   **`src/styles/`**: Global styles, theme definitions, and CSS variable declarations will live here.
*   **`src/utils/`**: For small, pure helper functions that can be used across the application (e.g., a function to format a score).
*   **`public/`**: For all static assets, including images, fonts, and the initial `quiz.json` file for MVP1.

## **3. Naming Conventions**

Consistent naming is critical for readability.

*   **Components:** `PascalCase` (e.g., `QuizCard`, `ProgressBar`).
*   **Variables & Functions:** `camelCase` (e.g., `userScore`, `fetchQuestions`).
*   **Styled-Components:** `PascalCase` and prefixed with `Styled` (e.g., `const StyledButton = styled.button...`).
*   **Component Files:** Component logic will be in `index.jsx` inside a `PascalCase` directory.

## **4. React Component Design**

*   **Functional Components Only:** All components **must** be functional components using React Hooks. Class-based components are not to be used.
*   **Destructure Props:** Always destructure props at the top of the component for clarity.
*   **Explicit Returns:** Use explicit `return` statements. Avoid implicit returns for multi-line JSX to maintain clarity.

## **5. State Management**

*   **KISS Principle:** For MVP1, state will be managed simply.
*   **`useState`**: Use for all local component state.
*   **`useContext`**: Use sparingly for global state that is needed across many components (e.g., the current quiz theme, user's high score). We will avoid more complex state management libraries like Redux until they are absolutely necessary.

## **6. Code Formatting & Commenting**

*   **Automated Formatting:** We will use **Prettier** to automatically format all code on save. This ensures a 100% consistent style and removes any debates about formatting.
*   **Function Comments:** All non-trivial functions must have a JSDoc-style comment block above them explaining their purpose, parameters, and what they return.
    ```javascript
    /**
     * Calculates the final percentage score for the user.
     * @param {number} score - The number of correct answers.
     * @param {number} totalQuestions - The total number of questions in the quiz.
     * @returns {number} The user's score as a percentage.
     */
    ```
*   **Inline Comments:** Use `//` for comments on a single line to explain a specific, non-obvious piece of logic.

---

## **7. Implementation Status & Standards Applied**

### **7.1. Component Architecture - IMPLEMENTED**

✅ **Current Components Following Standards:**
- `Background/index.jsx` - Canvas-based animated space background with particle system
- `QuizCard/index.jsx` - Reusable quiz question display component with glass morphism styling
- All components use functional components with hooks
- Proper prop destructuring implemented
- PascalCase naming convention followed
- Clean separation of concerns between components

### **7.2. Page Structure - IMPLEMENTED**

✅ **Current Pages Following Standards:**
- `HomePage.jsx` - Entry point with user name collection and high score display
- `QuizPage.jsx` - Quiz interface with navigation, scoring, and progress tracking
- `ScorePage.jsx` - Results display with high score tracking and replay functionality
- All pages use React Router for navigation
- State management using useState and navigation state
- Consistent styling and user experience patterns

### **7.3. Styling Standards - IMPLEMENTED**

✅ **Current Styling Implementation:**
- Styled-components with PascalCase naming (e.g., `StyledContainer`, `StyledButton`)
- Centralized theme system in `src/styles/theme.js` with space color palette
- Global styles in `src/styles/globalStyles.js` with Montserrat font integration
- Glass morphism effects consistently applied throughout the application
- Mobile-responsive design patterns with optimized particle counts
- Consistent color scheme: Primary (#22d3ee), Secondary (#a5b4fc), Background (#111827)

### **7.4. Data Management - IMPLEMENTED**

✅ **Current Data Patterns:**
- Static quiz data in `public/quiz.json` with 5 questions covering multiple topics
- localStorage for user data persistence (username and high scores)
- Proper error handling for data loading and state management
- Clean separation between data and presentation layers
- JSON structure with id, question, options, answer, difficulty, and category fields

### **7.5. Navigation Standards - IMPLEMENTED**

✅ **Current Navigation Implementation:**
- React Router DOM 7.6.3 with BrowserRouter
- Clean URL structure (/, /quiz, /score)
- State passing between routes for score data
<<<<<<< HEAD
- Consistent navigation components (Home buttons)
- Proper route protection and flow control

### **7.6. Documentation Standards - IMPLEMENTED**

✅ **Current Documentation Implementation:**
- Comprehensive project documentation in `memory-bank/` directory
- Notion Projects database for high-level project tracking
- Regular updates to progress tracker and architecture documents
- Living documentation that reflects current project state
- Version control integration with documentation updates 
=======
- Consistent navigation components (Home buttons on quiz and score pages)
- Proper route protection and flow control
- Seamless user experience from homepage to quiz to results

### **7.6. Performance Standards - IMPLEMENTED**

✅ **Current Performance Implementation:**
- Canvas animation optimized for mobile devices with dynamic particle counts
- RequestAnimationFrame for smooth background animation
- Proper cleanup of animation loops to prevent memory leaks
- Responsive design with breakpoint considerations
- Optimized bundle size with Vite build system

### **7.7. Error Handling - IMPLEMENTED**

✅ **Current Error Handling:**
- Graceful handling of localStorage operations
- Proper state management for quiz progression
- Fallback behaviors for missing user data
- Clean error boundaries for component rendering
- User-friendly feedback for all interactions

---

## **8. Current Code Quality Metrics**

### **✅ Standards Compliance**
- **Component Modularity:** All components follow single responsibility principle
- **Naming Conventions:** 100% compliance with PascalCase for components, camelCase for variables
- **Functional Components:** 100% of components use functional approach with hooks
- **Styled-Components:** Consistent naming and theming patterns
- **File Structure:** Clean organization following established conventions

### **📁 Current File Structure**
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

### **🎯 Ready for Next Phase**
The current codebase fully adheres to all established coding standards and is ready for MVP2 enhancements, including backend integration and AI-powered features. 
>>>>>>> review-documentation-update
