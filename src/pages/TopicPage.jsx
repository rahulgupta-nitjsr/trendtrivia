import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const TopicContainer = styled.div`
  max-width: 800px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing.large};
`;

const BackButton = styled.button`
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-family: ${({ theme }) => theme.fonts.main};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xsmall};

  &:hover {
    background: rgba(0, 191, 255, 0.2);
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  }
`;

const TopicCard = styled.div`
  ${({ theme }) => theme.glass};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.large};
`;

const TopicTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
  text-shadow: ${({ theme }) => theme.shadows.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-weight: 700;
  text-align: center;
`;

const TopicDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-align: center;
  line-height: 1.6;
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-weight: 600;
`;

const RulesText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  line-height: 1.6;
`;

const DurationContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  flex-wrap: wrap;
`;

const DurationButton = styled.button`
  background: ${({ isActive, theme }) => 
    isActive ? 'rgba(0, 191, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)'};
  color: ${({ isActive, theme }) => 
    isActive ? theme.colors.text : theme.colors.textSecondary};
  border: 1px solid ${({ isActive, theme }) => 
    isActive ? theme.colors.primary : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-family: ${({ theme }) => theme.fonts.main};
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  text-shadow: ${({ isActive, theme }) => isActive ? theme.shadows.text : 'none'};

  &:hover {
    background: rgba(0, 191, 255, 0.1);
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const StartButton = styled.button`
  width: 100%;
  background: rgba(0, 191, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  font-family: ${({ theme }) => theme.fonts.main};
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 0 15px ${({ theme }) => theme.colors.primary};
  text-shadow: ${({ theme }) => theme.shadows.text};

  &:hover {
    box-shadow: 0 0 25px ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
    background: rgba(0, 191, 255, 0.3);
  }
`;

const TopicPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDuration, setSelectedDuration] = useState('month');
  
  // Get topic from location state or default to 'Finance'
  const topic = location.state?.topic || 'Finance';

  const handleBackClick = () => {
    navigate('/');
  };

  const handleDurationSelect = (duration) => {
    setSelectedDuration(duration);
  };

  const handleStartQuiz = () => {
    navigate('/quiz', { 
      state: { 
        topic, 
        duration: selectedDuration 
      } 
    });
  };

  return (
    <TopicContainer>
      <BackButton onClick={handleBackClick}>
        ← Back
      </BackButton>
      
      <TopicCard>
        <TopicTitle>{topic} Trivia</TopicTitle>
        <TopicDescription>
          Test your knowledge on the latest {topic.toLowerCase()} trends and innovations.
        </TopicDescription>
        
        <SectionTitle>Rules</SectionTitle>
        <RulesText>
          Answer 10 questions about the latest {topic.toLowerCase()} news. Each correct answer earns you points, 
          and the faster you answer, the more points you get. Compete with others and beat your high score!
        </RulesText>
        
        <SectionTitle>Duration</SectionTitle>
        <DurationContainer>
          <DurationButton 
            isActive={selectedDuration === 'week'} 
            onClick={() => handleDurationSelect('week')}
          >
            Last Week
          </DurationButton>
          <DurationButton 
            isActive={selectedDuration === 'month'} 
            onClick={() => handleDurationSelect('month')}
          >
            Last Month
          </DurationButton>
          <DurationButton 
            isActive={selectedDuration === 'year'} 
            onClick={() => handleDurationSelect('year')}
          >
            Last Year
          </DurationButton>
        </DurationContainer>
        
        <StartButton onClick={handleStartQuiz}>
          Start Quiz
        </StartButton>
      </TopicCard>
    </TopicContainer>
  );
};

export default TopicPage; 