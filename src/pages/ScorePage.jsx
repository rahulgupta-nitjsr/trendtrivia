import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const ScoreContainer = styled.div`
  max-width: 600px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing.large};
  text-align: center;
  position: relative;
`;

const HomeButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-family: ${({ theme }) => theme.fonts.main};
  cursor: pointer;
  transition: all 0.2s ease-in-out;

  &:hover {
    background: rgba(0, 191, 255, 0.2);
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  }
`;

const ScoreCard = styled.div`
  ${({ theme }) => theme.glass};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  margin-top: ${({ theme }) => theme.spacing.xlarge};
`;

const ScoreHeading = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
  text-shadow: ${({ theme }) => theme.shadows.text};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-weight: 700;
`;

const ScoreStatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const ScoreStat = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium};
  text-align: center;
`;

const StatValue = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.text};
  font-weight: bold;
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
  text-shadow: ${({ theme }) => theme.shadows.text};
`;

const StatLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PerformanceSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-weight: 600;
  text-align: left;
`;

const PerformanceItem = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  text-align: left;
`;

const PerformanceHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

const CategoryName = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.text};
  font-weight: 500;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

const ProgressBar = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease-in-out;
`;

const CategoryScore = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const PlayAgainButton = styled.button`
  background: ${({ theme }) => theme.colors.primary};
  color: #000;
  border: none;
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 0 15px ${({ theme }) => theme.colors.primary};

  &:hover {
    box-shadow: 0 0 25px ${({ theme }) => theme.colors.primary};
    transform: translateY(-2px);
  }
`;

const BackHomeButton = styled.button`
  background: rgba(255, 255, 255, 0.05);
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium} ${({ theme }) => theme.spacing.large};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease-in-out;

  &:hover {
    background: rgba(0, 191, 255, 0.1);
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text};
  }
`;

const ScorePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  // Mock performance data - in a real app, this would come from the quiz results
  const performanceData = [
    { category: 'Technology', correct: 4, total: 5 },
    { category: 'Finance', correct: 3, total: 5 },
    { category: 'Entertainment', correct: 2, total: 5 },
    { category: 'General', correct: 1, total: 5 },
  ];

  useEffect(() => {
    // Get the score from navigation state or localStorage as fallback
    const score = location.state?.score || 0;
    setCurrentScore(score);

    // Get current high score
    const storedHighScore = localStorage.getItem('trendtrivia-highscore');
    const currentHighScore = storedHighScore ? parseInt(storedHighScore) : 0;

    // Check if this is a new high score
    if (score > currentHighScore) {
      localStorage.setItem('trendtrivia-highscore', score.toString());
      setHighScore(score);
      setIsNewHighScore(true);
    } else {
      setHighScore(currentHighScore);
      setIsNewHighScore(false);
    }
  }, [location.state]);

  const handlePlayAgain = () => {
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const totalQuestions = 5; // Based on our quiz data
  const correctAnswers = currentScore;

  return (
    <ScoreContainer>
      <HomeButton onClick={handleHomeClick}>Home</HomeButton>
      
      <ScoreCard>
        <ScoreHeading>
          {isNewHighScore ? 'NEW HIGH SCORE!' : 'Game Over!'}
        </ScoreHeading>
        
        <ScoreStatsContainer>
          <ScoreStat>
            <StatValue>{currentScore * 10}</StatValue>
            <StatLabel>Final Score</StatLabel>
          </ScoreStat>
          <ScoreStat>
            <StatValue>{correctAnswers}/{totalQuestions}</StatValue>
            <StatLabel>Correct Answers</StatLabel>
          </ScoreStat>
        </ScoreStatsContainer>

        <PerformanceSection>
          <SectionTitle>Performance by Topic</SectionTitle>
          {performanceData.map((item, index) => {
            const percentage = (item.correct / item.total) * 100;
            return (
              <PerformanceItem key={index}>
                <PerformanceHeader>
                  <CategoryName>{item.category}</CategoryName>
                </PerformanceHeader>
                <ProgressBarContainer>
                  <ProgressBar style={{ width: `${percentage}%` }} />
                </ProgressBarContainer>
                <CategoryScore>{item.correct}/{item.total}</CategoryScore>
              </PerformanceItem>
            );
          })}
        </PerformanceSection>

        <ButtonContainer>
          <PlayAgainButton onClick={handlePlayAgain}>
            Play Again
          </PlayAgainButton>
          <BackHomeButton onClick={handleBackToHome}>
            Back to Home
          </BackHomeButton>
        </ButtonContainer>
      </ScoreCard>
    </ScoreContainer>
  );
};

export default ScorePage; 