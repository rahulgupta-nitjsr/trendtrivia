import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;700&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: ${({ theme }) => theme.fonts.main};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.6;
    overflow-x: hidden;
    position: relative;
    min-height: 100vh;
    
    /* Space background gradient matching portfolio */
    background: radial-gradient(ellipse at bottom, #1f2937 0%, #111827 100%);
  }

  /* Space stars background effect from portfolio */
  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -3;
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

  @keyframes sparkle {
    from { transform: translateX(0); }
    to { transform: translateX(-150px); }
  }

  /* Mobile optimization for space background */
  @media (max-width: 768px) {
    body::before {
      background-size: 100px 60px;
      animation: sparkle 30s linear infinite;
      opacity: 0.7;
    }
    
    @keyframes sparkle {
      from { transform: translateX(0); }
      to { transform: translateX(-100px); }
    }
  }

  /* Scrollbar styling */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(31, 41, 55, 0.3);
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primary};
  }

  /* Selection styling */
  ::selection {
    background: rgba(34, 211, 238, 0.3);
    color: ${({ theme }) => theme.colors.textWhite};
  }

  /* Focus styles */
  button:focus,
  input:focus,
  textarea:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }

  /* Enhanced glass morphism utilities */
  .glass-card {
    ${({ theme }) => theme.glassCard}
    border-radius: ${({ theme }) => theme.borderRadiusLarge};
  }

  .glass-card:hover {
    background: rgba(31, 41, 55, 0.2);
    border: 1px solid rgba(34, 211, 238, 0.3);
    box-shadow: 0 16px 48px 0 rgba(34, 211, 238, 0.2);
    transform: translateY(-8px) scale(1.02);
  }

  .glass-button {
    ${({ theme }) => theme.glassButton}
    border-radius: ${({ theme }) => theme.borderRadius};
    font-family: ${({ theme }) => theme.fonts.main};
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-decoration: none;
    color: ${({ theme }) => theme.colors.text};
  }

  .glass-button:hover {
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.3) 0%, rgba(34, 211, 238, 0.2) 100%);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px 0 rgba(34, 211, 238, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }

  /* Floating animation from portfolio */
  @keyframes floating {
    0% { transform: translate(0, 0px); }
    50% { transform: translate(0, -10px); }
    100% { transform: translate(0, 0px); }
  }

  .floating {
    animation: floating 3s ease-in-out infinite;
  }

  /* Reveal animation from portfolio */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s ease-out;
  }

  .reveal.revealed {
    opacity: 1;
    transform: translateY(0);
  }

  /* Scale hover effect from portfolio */
  .scale-hover {
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  }

  .scale-hover:hover {
    transform: translateY(-5px) scale(1.03);
  }

  /* Pulse glow effect from portfolio */
  .pulse-glow {
    animation: pulse-glow 2s ease-in-out infinite;
  }

  @keyframes pulse-glow {
    0%, 100% {
      box-shadow: 0 0 20px rgba(34, 211, 238, 0.2);
    }
    50% {
      box-shadow: 0 0 40px rgba(34, 211, 238, 0.4);
    }
  }

  /* Typography enhancements */
  h1, h2, h3, h4, h5, h6 {
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: ${({ theme }) => theme.spacing.medium};
  }

  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xxlarge};
    color: ${({ theme }) => theme.colors.textWhite};
  }

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.xlarge};
    color: ${({ theme }) => theme.colors.primary};
  }

  h3 {
    font-size: ${({ theme }) => theme.fontSizes.large};
    color: ${({ theme }) => theme.colors.secondary};
  }

  p {
    margin-bottom: ${({ theme }) => theme.spacing.medium};
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  /* Link styling */
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    transition: color ${({ theme }) => theme.transitions.fast};
  }

  a:hover {
    color: ${({ theme }) => theme.colors.textWhite};
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    body {
      font-size: ${({ theme }) => theme.fontSizes.small};
    }

    h1 {
      font-size: ${({ theme }) => theme.fontSizes.xlarge};
    }

    h2 {
      font-size: ${({ theme }) => theme.fontSizes.large};
    }

    .glass-card:hover,
    .scale-hover:hover {
      transform: none;
    }
  }
`; 