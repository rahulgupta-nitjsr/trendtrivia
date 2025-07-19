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
    background: ${({ theme }) => theme.colors.primary};
    color: #000;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ScoreCard = styled.div`
  ${({ theme }) => theme.glass};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const ScoreHeading = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-weight: 700;
`;

const ScoreText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-weight: 600;
`;

const HighScoreText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
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

const ScorePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentScore, setCurrentScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

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

  const handleHomeClick = () => {
    navigate('/');
  };

      return (
      <ScoreContainer>
        <HomeButton onClick={handleHomeClick}>Home</HomeButton>
        <ScoreCard>
        <ScoreHeading>
          {isNewHighScore ? 'NEW HIGH SCORE!' : 'QUIZ COMPLETE!'}
        </ScoreHeading>
        
        <ScoreText>Your Score: {currentScore}</ScoreText>
        
        <HighScoreText>
          High Score: {highScore}
          {isNewHighScore && ' 🎉'}
        </HighScoreText>
        
        <PlayAgainButton onClick={handlePlayAgain}>
          PLAY AGAIN
        </PlayAgainButton>
      </ScoreCard>
    </ScoreContainer>
  );
};

export default ScorePage; 