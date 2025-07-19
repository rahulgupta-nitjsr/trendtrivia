# **TrendTrivia - Technology Stack**

Version: 2.0
Last Updated: June 27, 2024  
Project Phase: MVP1

## **1. Introduction**

This document outlines the technologies chosen to build, run, and maintain the TrendTrivia application. Our primary goal is to select a modern, powerful, and scalable tech stack that aligns with our long-term vision.

This stack is designed to bring the vision outlined in the **Product Requirements Document** and the **Design Document** to life.

## **2. Guiding Principles for Our Choices**

*   **Leverage Modern Architecture:** Utilize a decoupled, serverless-first approach to ensure scalability and maintainability.
*   **Leverage Existing Assets:** Use the project's current accounts (Firebase, Cloudflare) and domain (`aiproductpm.com`) to ensure seamless integration.
*   **Modern & Scalable:** Choose technologies that are current, well-supported, and can grow with the project from a simple MVP to a full-featured application.
*   **Developer-Friendly:** Use technologies that are well-documented and have strong communities, making development faster and more efficient.
*   **Unified Language:** Use JavaScript/TypeScript across the entire stack where possible to maintain consistency.

## **3. The Tech Stack Explained**

Here is a breakdown of the chosen technologies, explained in simple terms.

---

### **Frontend (The User Interface) - IMPLEMENTED**

This is everything the user sees and interacts with in their browser.

*   **What We're Using:** **React 18.2.0** with **HTML5 Canvas** for animations.
*   **Implementation Status:** ✅ Complete
*   **Why We're Using It:**
    *   **React** is a leading technology for building dynamic user interfaces. It enables the creation of a fast, manageable, and component-based application, aligning with modern development practices.
    *   **HTML5 Canvas** (instead of React-Three-Fiber) provides the 2D animated space background with planets and stars, offering better performance and simpler implementation for our MVP1 needs.
*   **Key Features Implemented:**
    - Three-page application (Homepage, Quiz, Score)
    - Animated space background with particle system
    - Glass morphism effects throughout
    - Mobile-responsive design

---

### **Styling (The Look and Feel) - IMPLEMENTED**

This is how we apply the colors, fonts, and layouts from our Design Document to the application.

*   **What We're Using:** **Styled-components 6.1.8**.
*   **Implementation Status:** ✅ Complete
*   **Why We're Using It:** This tool lets us attach our styles directly to the interface components we build. This keeps our styling organized, prevents visual bugs, and makes it easy to ensure the app looks exactly as designed.
*   **Key Features Implemented:**
    - Complete theme system with space color palette
    - Glass morphism effects with backdrop-filter
    - Montserrat font integration
    - Responsive design breakpoints
    - Interactive button states and animations

---

### **Routing & Navigation - IMPLEMENTED**

This handles navigation between different pages of the application.

*   **What We're Using:** **React Router DOM 6.28.0**
*   **Implementation Status:** ✅ Complete
*   **Why We're Using It:** Enables client-side routing for a smooth, single-page application experience without full page reloads.
*   **Current Implementation:**
    - Three main routes: `/` (Homepage), `/quiz` (Quiz), `/score` (Score)
    - BrowserRouter for clean URLs
    - State passing between routes for score data
    - Navigation components (Home buttons) on all non-home pages

---

### **Backend (The "Engine Room")**

This is the hidden, behind-the-scenes part of our app that does the heavy lifting, like talking to the AI and the database.

*   **What We're Using:** **Firebase Cloud Functions**.
*   **Why We're Using It:** Utilizing a serverless architecture with Cloud Functions allows for automatic scaling and high efficiency, as the code only runs when needed. This approach is robust and lets us securely manage tasks like third-party API connections.

---

### **Database (The Memory) - IMPLEMENTED**

This is where we store all our application's data, like quiz questions and user scores.

*   **What We're Using:**
    *   **Phase 1 (MVP1):** ✅ **Static JSON file** (`public/quiz.json`) + **localStorage**
    *   **Phase 2 onwards:** **Firebase Firestore** (planned)
*   **Implementation Status:** ✅ Complete for MVP1
*   **Why We're Using It:** We are following the plan to start simple. A JSON file is perfect for our initial needs. localStorage handles user data persistence without requiring a backend.
*   **Current Implementation:**
    - 10 finance quiz questions stored in `public/quiz.json`
    - User names and high scores stored in browser localStorage
    - No server required for MVP1 functionality

---

### **Authentication (The Gatekeeper)**

This is how we will manage user accounts, allowing them to sign up and log in securely (planned for MVP2).

*   **What We're Using:** **Firebase Authentication**.
*   **Why We're Using It:** This is a secure, reliable, and scalable solution for managing user identity. It's built right into the Firebase platform we're already using, is simple to set up, and supports various login methods (email, Google, etc.).

---

### **AI Integration (The Brains)**

This is the Artificial Intelligence service we will use to generate the trivia questions.

*   **What We're Using:** **Perplexity API**.
*   **Why We're Using It:** This service will provide the core intelligence for our app's content generation. We will ensure all communication with this API is done securely from our backend, never from the user's browser, to protect credentials.

---

### **Deployment (Getting it Online)**

This is how we publish TrendTrivia so that people can access it on the internet.

*   **What We're Using:**
    *   **Frontend:** **Cloudflare Pages**.
    *   **Backend:** **Firebase**.
*   **Why We're Using It:** This strategy involves deploying the user-facing part of the app using the project's **Cloudflare Pages** account to the sub-path `aiproductpm.com/trendtrivia`. This leverages the existing domain and infrastructure. The backend services will live on Firebase. This separation of frontend and backend is a modern best practice that improves security and maintainability.

---

### **Testing (Quality Control)**

This is the process we'll use to ensure every part of the application works correctly and is free of bugs.

*   **What We're Using:** **Jest** and **React Testing Library**.
*   **Why We're Using It:** This is the professional standard for testing React applications. It allows us to automatically check that each component of our app works as expected, and that they all work together correctly, leading to a high-quality, reliable product.

---

### **Security (The Guardian)**

This refers to the methods we use to keep our application and user data safe.

*   **What We're Using:** **Backend for Frontend (BFF) pattern** and **Firebase Security Rules**.
*   **Why We're Using It:**
    *   We will use a **BFF** approach, which means our frontend app never holds sensitive information like API keys. It asks our backend to do the work, and the backend makes the secure request.
    *   We will use **Firebase's Security Rules** to create a powerful firewall for our database, ensuring users can only access the data they are supposed to. 