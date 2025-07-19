import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import QuizCard from '../components/QuizCard';

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

const ScoreText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  text-align: right;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: ${({ theme }) => theme.shadows.text};
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

      return (
      <QuizContainer>
        <HomeButton onClick={handleHomeClick}>Home</HomeButton>
        <ScoreText>Score: {score}</ScoreText>
      <QuizCard
        question={questions[currentQuestionIndex]}
        onAnswerSelect={handleAnswerSelect}
        selectedAnswer={selectedAnswer}
        isAnswered={isAnswered}
      />
      {isAnswered && (
        <NextButton onClick={handleNextQuestion}>
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
        </NextButton>
      )}
    </QuizContainer>
  );
};

export default QuizPage; 