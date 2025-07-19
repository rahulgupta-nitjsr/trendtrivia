export const theme = {
  colors: {
    primary: '#00BFFF', // Brighter cyan/blue to match the image
    secondary: '#a5b4fc', // Light Purplish-blue from reference
    background: '#0B1426', // Darker space background to match image
    cardBackground: 'rgba(31, 41, 55, 0.1)', // From .glass style
    text: '#00BFFF', // Bright cyan for main text like in image
    textSecondary: '#B0C4DE', // Light steel blue for secondary text
    textWhite: '#FFFFFF', // White text when needed
    border: 'rgba(0, 191, 255, 0.2)', // Updated to match new primary color
    success: '#3FB950',
    danger: '#F85149',
  },
  fonts: {
    main: "'Exo 2', 'Orbitron', 'Montserrat', sans-serif", // More futuristic fonts to match the image
    heading: "'Exo 2', 'Orbitron', 'Montserrat', sans-serif",
  },
  fontSizes: {
    small: '0.9rem',
    medium: '1.1rem',
    large: '1.6rem',
    xlarge: '2.8rem',
  },
  spacing: {
    xsmall: '5px',
    small: '10px',
    medium: '20px',
    large: '30px',
    xlarge: '40px',
  },
  shadows: {
    card: '0 8px 32px 0 rgba(0, 191, 255, 0.15)', // Updated to match new primary color
    text: '0 0 8px rgba(0, 191, 255, 0.6)', // Bright cyan glow effect like in image
  },
  borderRadius: '16px', // A common modern radius
  glass: `
    background: rgba(31, 41, 55, 0.1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border: 1px solid rgba(0, 191, 255, 0.2);
    box-shadow: 0 8px 32px 0 rgba(0, 191, 255, 0.15);
  `
}; 