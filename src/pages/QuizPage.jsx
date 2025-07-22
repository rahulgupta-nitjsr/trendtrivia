import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const QuizContainer = styled.div`
  max-width: 800px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing.large};
  position: relative;
`;

const HomeButton = styled.button`
  position: absolute;
  top: 0;
  left: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-family: ${({ theme }) => theme.fonts.main};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  text-shadow: ${({ theme }) => theme.shadows.text};

  &:hover {
    background: rgba(0, 191, 255, 0.2);
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 10px ${({ theme }) => theme.colors.primary};
  }
`;

const QuestionCard = styled.div`
  ${({ theme }) => theme.glass};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.large};
  margin-top: ${({ theme }) => theme.spacing.xlarge};
`;

const ProgressSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const ProgressText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressBar = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.primary};
  transition: width 0.3s ease-in-out;
  border-radius: 4px;
  box-shadow: 0 0 8px ${({ theme }) => theme.colors.primary};
`;

const ScoreText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  text-align: right;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: ${({ theme }) => theme.shadows.text};
  position: absolute;
  top: ${({ theme }) => theme.spacing.large};
  right: ${({ theme }) => theme.spacing.large};
`;

const QuestionText = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  line-height: 1.4;
  text-shadow: ${({ theme }) => theme.shadows.text};
`;

const OptionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const OptionButton = styled.button`
  background: ${({ isSelected, isCorrect, isWrong, theme }) => {
    if (isCorrect) return 'rgba(59, 185, 80, 0.2)';
    if (isWrong) return 'rgba(248, 81, 73, 0.2)';
    if (isSelected) return 'rgba(0, 191, 255, 0.2)';
    return 'rgba(255, 255, 255, 0.05)';
  }};
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ isSelected, isCorrect, isWrong, theme }) => {
    if (isCorrect) return '#3fb950';
    if (isWrong) return '#f85149';
    if (isSelected) return theme.colors.primary;
    return 'rgba(255, 255, 255, 0.1)';
  }};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-family: ${({ theme }) => theme.fonts.main};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  text-align: left;

  &:hover:not(:disabled) {
    background: rgba(0, 191, 255, 0.1);
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const OptionLetter = styled.div`
  background: rgba(255, 255, 255, 0.1);
  color: ${({ theme }) => theme.colors.textSecondary};
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
`;

const NextButton = styled.button`
  width: 100%;
  background: rgba(0, 191, 255, 0.2);
  color: ${({ theme }) => theme.colors.text};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium};
  margin-top: ${({ theme }) => theme.spacing.medium};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 500;
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

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/quiz.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setQuestions(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswerSelect = (option) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);
    if (option === questions[currentQuestionIndex].answer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    setIsAnswered(false);
    setSelectedAnswer(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Quiz finished, navigate to score page with final score
      navigate('/score', { state: { score: score + (selectedAnswer === questions[currentQuestionIndex].answer ? 1 : 0) } });
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  if (loading) return <p>Loading questions...</p>;
  if (error) return <p>Error loading questions: {error}</p>;
  if (questions.length === 0) return <p>No questions found.</p>;

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <QuizContainer>
      <HomeButton onClick={handleHomeClick}>Home</HomeButton>
      <ScoreText>Score: {score}</ScoreText>
      
      <QuestionCard>
        <ProgressSection>
          <ProgressText>
            Question {currentQuestionIndex + 1} of {questions.length}
          </ProgressText>
          <ProgressBarContainer>
            <ProgressBar style={{ width: `${progressPercentage}%` }} />
          </ProgressBarContainer>
        </ProgressSection>

        <QuestionText>{currentQuestion.question}</QuestionText>

        <OptionsContainer>
          {currentQuestion.options.map((option, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C, D
            const isSelected = selectedAnswer === option;
            const isCorrect = isAnswered && option === currentQuestion.answer;
            const isWrong = isAnswered && isSelected && option !== currentQuestion.answer;

            return (
              <OptionButton
                key={index}
                onClick={() => handleAnswerSelect(option)}
                disabled={isAnswered}
                isSelected={isSelected}
                isCorrect={isCorrect}
                isWrong={isWrong}
              >
                <OptionLetter>{letter}</OptionLetter>
                <span>{option}</span>
              </OptionButton>
            );
          })}
        </OptionsContainer>

        {isAnswered && (
          <NextButton onClick={handleNextQuestion}>
            {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </NextButton>
        )}
      </QuestionCard>
    </QuizContainer>
  );
};

export default QuizPage; 