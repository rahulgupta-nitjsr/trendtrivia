import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const QuizContainer = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing.xlarge} ${({ theme }) => theme.spacing.large};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
`;

const HomeButton = styled.button`
  ${({ theme }) => theme.glassButton}
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 500;
  cursor: pointer;
  position: absolute;
  top: ${({ theme }) => theme.spacing.large};
  left: ${({ theme }) => theme.spacing.large};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px 0 rgba(34, 211, 238, 0.3);
  }

  .icon {
    transition: transform 0.2s ease;
  }

  &:hover .icon {
    transform: translateX(-3px);
  }

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    left: 0;
    align-self: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.large};
  }
`;

const ProgressSection = styled.div`
  ${({ theme }) => theme.glass}
  border-radius: ${({ theme }) => theme.borderRadiusLarge};
  padding: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
  text-align: center;
`;

const QuestionCounter = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-weight: 700;
`;

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background: rgba(31, 41, 55, 0.3);
  border-radius: 10px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const ProgressBar = styled.div`
  height: 100%;
  background: linear-gradient(90deg, #22d3ee, #a5b4fc);
  border-radius: 10px;
  width: ${({ progress }) => progress}%;
  transition: width 0.5s ease-in-out;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
    animation: shimmer 2s infinite;
  }

  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 100%; }
  }
`;

const ProgressText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const QuestionSection = styled.div`
  ${({ theme }) => theme.glass}
  border-radius: ${({ theme }) => theme.borderRadiusXLarge};
  padding: ${({ theme }) => theme.spacing.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
  position: relative;
  overflow: hidden;
  
  /* Floating animation */
  animation: floating 6s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 25% 25%, rgba(34, 211, 238, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(165, 180, 252, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const QuestionText = styled.h1`
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  color: ${({ theme }) => theme.colors.textWhite};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
  line-height: 1.3;
  text-align: center;
  font-weight: 600;
`;

const DifficultyBadge = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  
  background: ${({ difficulty, theme }) => {
    switch(difficulty) {
      case 'Easy': return 'linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(16, 185, 129, 0.1))';
      case 'Medium': return 'linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(245, 158, 11, 0.1))';
      case 'Hard': return 'linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(239, 68, 68, 0.1))';
      default: return 'linear-gradient(135deg, rgba(34, 211, 238, 0.2), rgba(34, 211, 238, 0.1))';
    }
  }};
  
  color: ${({ difficulty, theme }) => {
    switch(difficulty) {
      case 'Easy': return theme.colors.success;
      case 'Medium': return theme.colors.warning;
      case 'Hard': return theme.colors.danger;
      default: return theme.colors.primary;
    }
  }};
  
  border: 1px solid ${({ difficulty, theme }) => {
    switch(difficulty) {
      case 'Easy': return 'rgba(16, 185, 129, 0.3)';
      case 'Medium': return 'rgba(245, 158, 11, 0.3)';
      case 'Hard': return 'rgba(239, 68, 68, 0.3)';
      default: return 'rgba(34, 211, 238, 0.3)';
    }
  }};
`;

const OptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.medium};
  }
`;

const OptionButton = styled.button`
  ${({ theme }) => theme.glassButton}
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadiusLarge};
  border: 1px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary : 'rgba(34, 211, 238, 0.2)'};
  cursor: pointer;
  text-align: left;
  position: relative;
  overflow: hidden;
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.medium};
  
  background: ${({ selected, theme }) => 
    selected 
      ? 'linear-gradient(135deg, rgba(34, 211, 238, 0.3) 0%, rgba(34, 211, 238, 0.2) 100%)'
      : theme.glassButton
  };
  
  /* Enhanced hover effects from portfolio */
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:hover {
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.25) 0%, rgba(34, 211, 238, 0.15) 100%);
    transform: translateY(-5px) scale(1.02);
    box-shadow: 0 16px 48px 0 rgba(34, 211, 238, 0.3);
    border-color: rgba(34, 211, 238, 0.4);
  }

  /* Magnetic hover effect for selected state */
  ${({ selected }) => selected && `
    &:hover::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(45deg, #22d3ee, #a5b4fc, #22d3ee);
      border-radius: inherit;
      z-index: -1;
      opacity: 0.7;
      animation: rotate-gradient 2s linear infinite;
    }

    @keyframes rotate-gradient {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `}

  @media (max-width: 768px) {
    min-height: 70px;
    
    &:hover {
      transform: none;
      box-shadow: 0 8px 32px 0 rgba(34, 211, 238, 0.2);
    }
    
    &:hover::before {
      display: none;
    }
  }
`;

const OptionLetter = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.secondary});
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textWhite};
  flex-shrink: 0;
`;

const OptionText = styled.span`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
  flex: 1;
`;

const NextButton = styled.button`
  ${({ theme }) => theme.glassButton}
  padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.xlarge};
  border-radius: ${({ theme }) => theme.borderRadiusLarge};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 700;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  position: relative;
  overflow: hidden;
  margin: 0 auto;
  display: block;
  min-width: 200px;
  
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.3) 0%, rgba(34, 211, 238, 0.2) 100%);
  border: 2px solid ${({ theme }) => theme.colors.primary};
  box-shadow: 0 8px 32px 0 rgba(34, 211, 238, 0.3);
  
  opacity: ${({ disabled }) => disabled ? 0.5 : 1};
  cursor: ${({ disabled }) => disabled ? 'not-allowed' : 'pointer'};
  
  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.4) 0%, rgba(34, 211, 238, 0.3) 100%);
    transform: translateY(-3px);
    box-shadow: 0 16px 48px 0 rgba(34, 211, 238, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(-1px);
  }
`;

function QuizPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);

  const { topic, category, duration } = location.state || { topic: 'Technology', category: 'technology', duration: 'month' };

  useEffect(() => {
    loadQuestions();
  }, [category]);

  const loadQuestions = async () => {
    try {
      const response = await fetch('/quiz.json');
      const allQuestions = await response.json();
      
      // Filter questions by category
      const categoryQuestions = allQuestions.filter(q => 
        q.category.toLowerCase() === category.toLowerCase()
      );
      
      // Shuffle and take 10 questions
      const shuffled = categoryQuestions.sort(() => Math.random() - 0.5);
      const selected = shuffled.slice(0, 10);
      
      setQuestions(selected);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleNext = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.answer;
    
    // Calculate points based on difficulty
    let points = 0;
    if (isCorrect) {
      switch (currentQuestion.difficulty) {
        case 'Easy': points = 1; break;
        case 'Medium': points = 2; break;
        case 'Hard': points = 3; break;
        default: points = 1;
      }
    }

    setScore(prevScore => prevScore + points);
    setAnswers(prev => [...prev, {
      question: currentQuestion.question,
      selectedAnswer,
      correctAnswer: currentQuestion.answer,
      isCorrect,
      difficulty: currentQuestion.difficulty,
      points
    }]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
    } else {
      // Quiz completed
      const finalScore = score + points;
      const highScore = localStorage.getItem('trendtrivia-highscore');
      if (!highScore || finalScore > parseInt(highScore)) {
        localStorage.setItem('trendtrivia-highscore', finalScore.toString());
      }
      
      navigate('/score', { 
        state: { 
          score: finalScore, 
          total: questions.length * 3, // Max possible score
          answers: [...answers, {
            question: currentQuestion.question,
            selectedAnswer,
            correctAnswer: currentQuestion.answer,
            isCorrect,
            difficulty: currentQuestion.difficulty,
            points
          }],
          topic,
          category
        } 
      });
    }
  };

  const handleHome = () => {
    navigate('/');
  };

  if (questions.length === 0) {
    return (
      <QuizContainer>
        <div style={{ textAlign: 'center', color: '#22d3ee' }}>
          Loading questions...
        </div>
      </QuizContainer>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <QuizContainer>
      <HomeButton onClick={handleHome}>
        <span className="icon">🏠</span>
        Home
      </HomeButton>

      <ProgressSection className="reveal">
        <QuestionCounter>
          Question {currentQuestionIndex + 1} of {questions.length}
        </QuestionCounter>
        <ProgressBarContainer>
          <ProgressBar progress={progress} />
        </ProgressBarContainer>
        <ProgressText>
          {Math.round(progress)}% Complete • {topic} Challenge
        </ProgressText>
      </ProgressSection>

      <QuestionSection className="reveal">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <DifficultyBadge difficulty={currentQuestion.difficulty}>
            {currentQuestion.difficulty} • {currentQuestion.difficulty === 'Easy' ? '1' : currentQuestion.difficulty === 'Medium' ? '2' : '3'} Point{currentQuestion.difficulty !== 'Easy' ? 's' : ''}
          </DifficultyBadge>
        </div>
        
        <QuestionText>{currentQuestion.question}</QuestionText>
        
        <OptionsGrid>
          {currentQuestion.options.map((option, index) => (
            <OptionButton
              key={index}
              selected={selectedAnswer === option}
              onClick={() => handleAnswerSelect(option)}
              className="reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <OptionLetter>{String.fromCharCode(65 + index)}</OptionLetter>
              <OptionText>{option}</OptionText>
            </OptionButton>
          ))}
        </OptionsGrid>

        <NextButton 
          onClick={handleNext}
          disabled={!selectedAnswer}
          className={selectedAnswer ? 'pulse-glow' : ''}
        >
          {currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
        </NextButton>
      </QuestionSection>
    </QuizContainer>
  );
}

export default QuizPage; 