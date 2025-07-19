import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  ${({ theme }) => theme.glass};
  border-radius: ${({ theme }) => theme.borderRadius};
  padding: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.large};
`;

const QuestionText = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.large};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-weight: 500;
  text-align: center;
  color: ${({ theme }) => theme.colors.text};
  text-shadow: ${({ theme }) => theme.shadows.text};
`;

const OptionButton = styled.button`
  display: block;
  width: 100%;
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 400;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  ${({ isCorrect, theme }) =>
    isCorrect &&
    `
    background: ${theme.colors.success};
    border-color: ${theme.colors.success};
    color: #fff;
  `}

  ${({ isIncorrect, theme }) =>
    isIncorrect &&
    `
    background: ${theme.colors.danger};
    border-color: ${theme.colors.danger};
    color: #fff;
  `}

  &:hover:not(:disabled) {
    background: rgba(0, 191, 255, 0.2);
    color: ${({ theme }) => theme.colors.text};
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 15px ${({ theme }) => theme.colors.primary};
    text-shadow: ${({ theme }) => theme.shadows.text};
  }

  &:disabled {
    cursor: not-allowed;
  }
`;

const QuizCard = ({ question, onAnswerSelect, selectedAnswer, isAnswered }) => {
  return (
    <Card>
      <QuestionText>{question.question}</QuestionText>
      <div>
        {question.options.map((option) => {
          const isCorrect = isAnswered && option === question.answer;
          const isIncorrect = isAnswered && selectedAnswer === option && option !== question.answer;

          return (
            <OptionButton
              key={option}
              onClick={() => onAnswerSelect(option)}
              disabled={isAnswered}
              isCorrect={isCorrect}
              isIncorrect={isIncorrect}
            >
              {option}
            </OptionButton>
          );
        })}
      </div>
    </Card>
  );
};

export default QuizCard; 