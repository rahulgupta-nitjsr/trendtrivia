import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HomeContainer = styled.div`
  max-width: 800px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing.large};
  text-align: center;
`;

const WelcomeCard = styled.div`
  ${({ theme }) => theme.glass};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const WelcomeText = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-weight: 400;
`;

const MainHeading = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
  text-shadow: ${({ theme }) => theme.shadows.text};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-weight: 400;
  letter-spacing: 0.1em;
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const TopicButton = styled.button`
  background: ${({ isActive, theme }) => 
    isActive ? 'rgba(0, 191, 255, 0.1)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ isActive, theme }) => 
    isActive ? theme.colors.text : theme.colors.textSecondary};
  border: 1px solid ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 400;
  cursor: ${({ isActive }) => isActive ? 'pointer' : 'not-allowed'};
  transition: all 0.3s ease-in-out;
  opacity: ${({ isActive }) => isActive ? 1 : 0.5};
  text-shadow: ${({ isActive, theme }) => isActive ? theme.shadows.text : 'none'};

  &:hover {
    ${({ isActive, theme }) => isActive && `
      box-shadow: 0 0 15px ${theme.colors.primary};
      transform: translateY(-2px);
      background: rgba(0, 191, 255, 0.2);
    `}
  }
`;

const HighScoreBanner = styled.div`
  position: relative;
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing.large};
  
  &::before {
    content: '';
    position: absolute;
    left: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-right: 20px solid rgba(0, 191, 255, 0.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    right: -20px;
    top: 50%;
    transform: translateY(-50%);
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-bottom: 15px solid transparent;
    border-left: 20px solid rgba(0, 191, 255, 0.2);
  }
`;

const HighScoreText = styled.div`
  background: rgba(0, 191, 255, 0.2);
  border: 1px solid ${({ theme }) => theme.colors.primary};
  padding: 10px 40px;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
  letter-spacing: 0.1em;
  text-shadow: ${({ theme }) => theme.shadows.text};
`;

const HomePage = () => {
  const [userName, setUserName] = useState('');
  const [highScore, setHighScore] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user name from localStorage or prompt for it
    const storedName = localStorage.getItem('trendtrivia-username');
    if (storedName) {
      setUserName(storedName);
    } else {
      const name = prompt('Welcome! What\'s your name?');
      if (name) {
        localStorage.setItem('trendtrivia-username', name);
        setUserName(name);
      }
    }

    // Get high score from localStorage
    const storedHighScore = localStorage.getItem('trendtrivia-highscore');
    if (storedHighScore) {
      setHighScore(parseInt(storedHighScore));
    }
  }, []);

  const handleTopicSelect = (topic) => {
    if (topic === 'Finance') {
      navigate('/quiz');
    }
  };

  return (
    <HomeContainer>
      <WelcomeCard>
        <WelcomeText>Welcome, {userName || 'Player'}!</WelcomeText>
        
        <MainHeading>SO YOU THINK YOU ARE UPTO DATE?</MainHeading>
        
        <TopicsGrid>
          <TopicButton 
            isActive={true} 
            onClick={() => handleTopicSelect('Finance')}
          >
            FINANCE
          </TopicButton>
          <TopicButton isActive={false}>
            ENTERTAINMENT
          </TopicButton>
          <TopicButton isActive={false}>
            WORLD
          </TopicButton>
          <TopicButton isActive={false}>
            GENERAL
          </TopicButton>
        </TopicsGrid>
        
        <HighScoreBanner>
          <HighScoreText>HIGH SCORE</HighScoreText>
        </HighScoreBanner>
      </WelcomeCard>
    </HomeContainer>
  );
};

export default HomePage; 