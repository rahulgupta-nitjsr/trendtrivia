import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Import manual testing utility (available in console, doesn't run automatically)
// import './utils/manualTesting.js' // File missing - commented out
import './utils/seedFirestore.js'

// Initialize local scheduler for AI generation
import { initializeLocalScheduler } from './services/localSchedulerService.js'

// Initialize the local scheduler
initializeLocalScheduler();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
) 