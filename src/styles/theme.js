export const theme = {
  colors: {
    primary: '#22d3ee', // Primary accent from portfolio
    secondary: '#a5b4fc', // Secondary accent from portfolio
    background: '#111827', // Dark background matching portfolio
    cardBackground: 'rgba(31, 41, 55, 0.15)', // Glass card background from portfolio
    text: '#f3f4f6', // Light text from portfolio
    textSecondary: '#9ca3af', // Medium text from portfolio
    textWhite: '#ffffff',
    accent: '#22d3ee', // Primary accent
    border: 'rgba(34, 211, 238, 0.2)', // Border with primary accent
    success: '#10b981',
    danger: '#ef4444',
    warning: '#f59e0b',
  },
  fonts: {
    main: "'Montserrat', 'Inter', system-ui, sans-serif", // Matching portfolio font
    heading: "'Montserrat', 'Inter', system-ui, sans-serif",
  },
  fontSizes: {
    small: '0.875rem',    // 14px
    medium: '1rem',       // 16px
    large: '1.5rem',      // 24px
    xlarge: '2rem',       // 32px
    xxlarge: '3rem',      // 48px
  },
  spacing: {
    xsmall: '0.25rem',    // 4px
    small: '0.5rem',      // 8px
    medium: '1rem',       // 16px
    large: '1.5rem',      // 24px
    xlarge: '2rem',       // 32px
  },
  shadows: {
    card: '0 8px 32px 0 rgba(34, 211, 238, 0.15)', // Primary accent shadow
    text: '0 0 8px rgba(34, 211, 238, 0.6)', // Text glow effect
    button: '0 8px 32px 0 rgba(34, 211, 238, 0.2)', // Button shadow
    hover: '0 16px 48px 0 rgba(34, 211, 238, 0.3)', // Hover shadow
  },
  borderRadius: '16px',
  borderRadiusLarge: '20px',
  borderRadiusXLarge: '24px',
  
  // Glass morphism styles matching portfolio
  glass: `
    background: rgba(31, 41, 55, 0.15);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border: 1px solid rgba(34, 211, 238, 0.15);
    box-shadow: 0 8px 32px 0 rgba(34, 211, 238, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  `,
  
  // Glass button styles from portfolio
  glassButton: `
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.2) 0%, rgba(34, 211, 238, 0.1) 100%);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(34, 211, 238, 0.3);
    box-shadow: 0 8px 32px 0 rgba(34, 211, 238, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  `,
  
  // Glass card styles from portfolio
  glassCard: `
    background: rgba(31, 41, 55, 0.1);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(34, 211, 238, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  `,

  // Interactive hover effects
  hover: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 16px 48px 0 rgba(34, 211, 238, 0.2)',
    borderColor: 'rgba(34, 211, 238, 0.3)',
  },
  
  // Animation durations
  transitions: {
    fast: '0.2s ease',
    normal: '0.3s ease',
    slow: '0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
  }
}; 