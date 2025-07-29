/**
 * Test Results Display Component
 * Shows automated test results in the browser UI
 */

import React, { useState, useEffect } from 'react';

const TestResults = () => {
  const [phase1Results, setPhase1Results] = useState(null);
  const [phase2Results, setPhase2Results] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check for test results every 2 seconds
    const checkForResults = () => {
      let hasResults = false;
      
      if (window.phase1TestResults) {
        setPhase1Results(window.phase1TestResults);
        hasResults = true;
      }
      
      if (window.phase2ComprehensiveResults) {
        setPhase2Results(window.phase2ComprehensiveResults);
        hasResults = true;
      }
      
      if (hasResults) {
        setIsVisible(true);
      }
    };

    const interval = setInterval(checkForResults, 2000);
    
    // Also check immediately
    checkForResults();

    return () => clearInterval(interval);
  }, []);

  if (!isVisible || (!phase1Results && !phase2Results)) {
    return null;
  }

  const hasPhase1 = !!phase1Results;
  const hasPhase2 = !!phase2Results;
  const phase1Success = phase1Results?.success;
  const phase2Success = phase2Results?.success;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '16px',
      maxWidth: '450px',
      zIndex: 9999,
      fontFamily: 'monospace',
      fontSize: '12px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '12px'
      }}>
        <h3 style={{ 
          margin: 0, 
          color: '#495057',
          fontSize: '14px'
        }}>
          🧪 Test Results
        </h3>
        <button 
          onClick={() => setIsVisible(false)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '16px',
            cursor: 'pointer',
            color: '#6c757d'
          }}
        >
          ×
        </button>
      </div>

      {hasPhase1 && (
        <div style={{ 
          marginBottom: '16px',
          padding: '12px',
          background: phase1Success ? '#d4edda' : '#f8d7da',
          borderRadius: '6px',
          border: `1px solid ${phase1Success ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ marginRight: '8px' }}>
              {phase1Success ? '✅' : '❌'}
            </span>
            <strong style={{ color: phase1Success ? '#155724' : '#721c24' }}>
              Phase 1: File-Based Dynamic Prompt System
            </strong>
          </div>
          
          {phase1Results && (
            <div style={{ fontSize: '11px', color: phase1Success ? '#155724' : '#721c24' }}>
              <div>Tests: {phase1Results.summary.passed}/{phase1Results.summary.totalTests} passed</div>
              <div>Success Rate: {phase1Results.summary.successRate.toFixed(1)}%</div>
            </div>
          )}
        </div>
      )}

      {hasPhase2 && (
        <div style={{ 
          padding: '12px',
          background: phase2Success ? '#d4edda' : '#f8d7da',
          borderRadius: '6px',
          border: `1px solid ${phase2Success ? '#c3e6cb' : '#f5c6cb'}`
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <span style={{ marginRight: '8px' }}>
              {phase2Success ? '✅' : '❌'}
            </span>
            <strong style={{ color: phase2Success ? '#155724' : '#721c24' }}>
              Phase 2: Enhanced AI Generation & Response Handling
            </strong>
          </div>
          
          {phase2Results && (
            <div style={{ fontSize: '11px', color: phase2Success ? '#155724' : '#721c24' }}>
              <div>Tests: {phase2Results.summary.passed}/{phase2Results.summary.totalTests} passed</div>
              <div>Success Rate: {phase2Results.summary.successRate.toFixed(1)}%</div>
            </div>
          )}
        </div>
      )}

      {hasPhase1 && hasPhase2 && phase1Success && phase2Success && (
        <div style={{ 
          marginTop: '12px', 
          padding: '8px',
          background: '#c3e6cb',
          borderRadius: '4px',
          color: '#155724',
          fontWeight: 'bold',
          textAlign: 'center'
        }}>
          🚀 Ready for Phase 3!
        </div>
      )}
    </div>
  );
};

export default TestResults; 