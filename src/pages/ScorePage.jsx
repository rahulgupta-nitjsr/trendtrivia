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

  // Get quiz data from navigation state
  const quizData = location.state || {};
  const answers = quizData.answers || [];
  const topic = quizData.topic || 'Quiz';
  
  // Simple calculations - exactly what the user wants
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter(answer => answer.isCorrect).length;
  const finalScore = answers.reduce((sum, answer) => sum + (answer.points || 0), 0);
  const totalAchievableScore = answers.reduce((sum, answer) => {
    const difficulty = answer.difficulty || 'Medium';
    const maxPoints = difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3;
    return sum + maxPoints;
  }, 0);

  // Debug logging to verify new version is loading
  console.log('🔍 ScorePage - NEW VERSION LOADED:', {
    totalQuestions,
    correctAnswers,
    finalScore,
    totalAchievableScore,
    topic,
    answers
  });

  useEffect(() => {
    // Use the calculated final score
    setCurrentScore(finalScore);

    // Get current high score
    const storedHighScore = localStorage.getItem('trendtrivia-highscore');
    const currentHighScore = storedHighScore ? parseInt(storedHighScore) : 0;

    // Check if this is a new high score
    if (finalScore > currentHighScore) {
      localStorage.setItem('trendtrivia-highscore', finalScore.toString());
      setHighScore(finalScore);
      setIsNewHighScore(true);
    } else {
      setHighScore(currentHighScore);
      setIsNewHighScore(false);
    }
  }, [finalScore]);

  const handlePlayAgain = () => {
    navigate('/');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  // Handle case where no quiz data is available
  if (totalQuestions === 0) {
    return (
      <ScoreContainer>
        <HomeButton onClick={handleHomeClick}>Home</HomeButton>
        <ScoreCard>
          <ScoreHeading>No Quiz Data Available</ScoreHeading>
          <p style={{ color: '#ef4444', textAlign: 'center' }}>
            Sorry, we couldn't find your quiz results. Please try taking the quiz again.
          </p>
          <ButtonContainer>
            <PlayAgainButton onClick={handlePlayAgain}>
              Take Quiz
            </PlayAgainButton>
          </ButtonContainer>
        </ScoreCard>
      </ScoreContainer>
    );
  }

  return (
    <ScoreContainer>
      <HomeButton onClick={handleHomeClick}>Home</HomeButton>
      
      <ScoreCard>
        <ScoreHeading>
          {isNewHighScore ? 'NEW HIGH SCORE!' : 'Quiz Complete!'}
        </ScoreHeading>
        
        {/* Simple Score Display - Exactly what user requested */}
        <div style={{ 
          textAlign: 'left', 
          fontSize: '18px', 
          lineHeight: '2',
          color: '#ffffff',
          background: 'rgba(255, 255, 255, 0.05)',
          padding: '30px',
          borderRadius: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          <div><strong>Topic:</strong> {topic}</div>
          <div><strong>Total Questions:</strong> {totalQuestions}</div>
          <div><strong>Questions Correct:</strong> {correctAnswers}</div>
          <div><strong>Your Final Score:</strong> {finalScore}</div>
          <div><strong>Total Achievable Score:</strong> {totalAchievableScore}</div>
        </div>

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