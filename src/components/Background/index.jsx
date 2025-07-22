import React from 'react';
import styled from 'styled-components';

const BackgroundContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  pointer-events: none;
`;

// Simple CSS-only space background matching portfolio
const SpaceBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(ellipse at bottom, #1f2937 0%, #111827 100%);
  
  /* Animated stars using CSS background patterns */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(1px 1px at 20px 30px, #22d3ee, transparent),
      radial-gradient(1px 1px at 40px 70px, rgba(165, 180, 252, 0.8), transparent),
      radial-gradient(1px 1px at 90px 40px, #22d3ee, transparent),
      radial-gradient(1px 1px at 130px 80px, rgba(165, 180, 252, 0.6), transparent),
      radial-gradient(1px 1px at 160px 30px, #22d3ee, transparent);
    background-repeat: repeat;
    background-size: 150px 80px;
    animation: sparkle 25s linear infinite;
    opacity: 0.6;
  }

  /* Additional layer for more depth */
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(2px 2px at 60px 120px, rgba(34, 211, 238, 0.4), transparent),
      radial-gradient(1px 1px at 180px 40px, rgba(165, 180, 252, 0.5), transparent),
      radial-gradient(1px 1px at 220px 90px, #22d3ee, transparent);
    background-repeat: repeat;
    background-size: 200px 120px;
    animation: sparkle 35s linear infinite reverse;
    opacity: 0.4;
  }

  @keyframes sparkle {
    from { transform: translateX(0); }
    to { transform: translateX(-150px); }
  }

  /* Mobile optimization */
  @media (max-width: 768px) {
    &::before {
      background-size: 100px 60px;
      animation: sparkle 30s linear infinite;
      opacity: 0.7;
    }
    
    &::after {
      background-size: 120px 80px;
      animation: sparkle 40s linear infinite reverse;
      opacity: 0.3;
    }
    
    @keyframes sparkle {
      from { transform: translateX(0); }
      to { transform: translateX(-100px); }
    }
  }
`;

// Floating nebula effects
const NebulaEffect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  /* Nebula gradients */
  background: 
    radial-gradient(circle at 20% 30%, rgba(34, 211, 238, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(165, 180, 252, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 60% 20%, rgba(34, 211, 238, 0.06) 0%, transparent 40%),
    radial-gradient(circle at 30% 80%, rgba(165, 180, 252, 0.05) 0%, transparent 40%);
  
  /* Subtle animation */
  animation: nebula-drift 60s ease-in-out infinite;
  
  @keyframes nebula-drift {
    0%, 100% { 
      transform: scale(1) rotate(0deg);
      opacity: 0.8;
    }
    25% { 
      transform: scale(1.1) rotate(90deg);
      opacity: 0.6;
    }
    50% { 
      transform: scale(0.9) rotate(180deg);
      opacity: 0.9;
    }
    75% { 
      transform: scale(1.05) rotate(270deg);
      opacity: 0.7;
    }
  }
`;

const Background = () => {
  return (
    <BackgroundContainer>
      <SpaceBackground />
      <NebulaEffect />
    </BackgroundContainer>
  );
};

export default Background; 