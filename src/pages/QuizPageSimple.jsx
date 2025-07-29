import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getQuizQuestions } from '../services/firestoreService';

function QuizPageSimple() {
  const navigate = useNavigate();
  const location = useLocation();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const { topic, category, duration } = location.state || { topic: 'Technology', category: 'technology', duration: 'month' };

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setIsLoading(true);
    
    try {
      const result = await getQuizQuestions({ 
        count: 10, 
        category: category 
      });
      
      if (result.success && result.questions.length > 0) {
        setQuestions(result.questions);
        console.log('✅ Loaded questions from database');
      } else {
        // Fallback questions
        const fallbackQuestions = [
          {
            id: 1,
            question: "What does 'AI' stand for?",
            options: ["Artificial Intelligence", "Automated Internet", "Advanced Interface", "Applied Innovation"],
            correct: "Artificial Intelligence",
            answer: "Artificial Intelligence",
            difficulty: "Easy",
            category: "technology"
          },
          {
            id: 2,
            question: "Which company developed the React framework?",
            options: ["Google", "Facebook", "Microsoft", "Apple"],
            correct: "Facebook",
            answer: "Facebook",
            difficulty: "Medium",
            category: "technology"
          },
          {
            id: 3,
            question: "What does 'HTTP' stand for?",
            options: ["HyperText Transfer Protocol", "High Tech Transfer Process", "Home Tool Transfer Program", "Host Text Transfer Protocol"],
            correct: "HyperText Transfer Protocol",
            answer: "HyperText Transfer Protocol",
            difficulty: "Easy",
            category: "technology"
          }
        ];
        setQuestions(fallbackQuestions);
        console.log('⚠️ Using fallback questions');
      }
    } catch (error) {
      console.error('Error loading questions:', error);
      // Use fallback on error
      const fallbackQuestions = [
        {
          id: 1,
          question: "What does 'AI' stand for?",
          options: ["Artificial Intelligence", "Automated Internet", "Advanced Interface", "Applied Innovation"],
          correct: "Artificial Intelligence",
          answer: "Artificial Intelligence",
          difficulty: "Easy",
          category: "technology"
        }
      ];
      setQuestions(fallbackQuestions);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answer) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer || currentQuestion.correct;
    const answerIsCorrect = selectedAnswer === correctAnswer;
    
    setIsCorrect(answerIsCorrect);
    setShowResult(true);
  };

  const handleNext = () => {
    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer || currentQuestion.correct;
    
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
      correctAnswer: correctAnswer,
      isCorrect,
      difficulty: currentQuestion.difficulty,
      points
    }]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer('');
      setShowResult(false);
    } else {
      // Quiz completed
      const finalScore = score + points;
      navigate('/score', { 
        state: { 
          score: finalScore, 
          total: questions.length * 3,
          answers: [...answers, {
            question: currentQuestion.question,
            selectedAnswer,
            correctAnswer: correctAnswer,
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

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#111827',
        color: '#22d3ee',
        fontSize: '18px'
      }}>
        Loading questions...
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#111827',
        color: '#ef4444',
        fontSize: '18px',
        flexDirection: 'column'
      }}>
        <p>❌ No questions available for this category.</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#22d3ee',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  if (!currentQuestion) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#111827',
        color: '#ef4444',
        fontSize: '18px',
        flexDirection: 'column'
      }}>
        <p>❌ Error: Question not found.</p>
        <button 
          onClick={() => navigate('/')}
          style={{
            marginTop: '20px',
            padding: '10px 20px',
            backgroundColor: '#22d3ee',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#111827',
      color: 'white',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      {/* Home Button */}
      <button 
        onClick={handleHome}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          backgroundColor: 'rgba(34, 211, 238, 0.2)',
          border: '1px solid rgba(34, 211, 238, 0.3)',
          borderRadius: '8px',
          color: '#22d3ee',
          cursor: 'pointer',
          fontSize: '14px'
        }}
      >
        🏠 Home
      </button>

      {/* Main Content */}
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: '80px'
      }}>
        {/* Progress Section */}
        <div style={{
          backgroundColor: 'rgba(31, 41, 55, 0.3)',
          border: '1px solid rgba(34, 211, 238, 0.2)',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          textAlign: 'center'
        }}>
          <h2 style={{
            fontSize: '24px',
            color: '#22d3ee',
            marginBottom: '15px',
            fontWeight: '700'
          }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </h2>
          
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: 'rgba(31, 41, 55, 0.3)',
            borderRadius: '4px',
            marginBottom: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: '#22d3ee',
              width: `${progress}%`,
              transition: 'width 0.5s ease'
            }}></div>
          </div>
          
          <p style={{
            fontSize: '14px',
            color: '#9ca3af',
            margin: '0'
          }}>
            {Math.round(progress)}% Complete • {topic} Challenge
          </p>
        </div>

        {/* Question Section */}
        <div style={{
          backgroundColor: 'rgba(31, 41, 55, 0.3)',
          border: '1px solid rgba(34, 211, 238, 0.2)',
          borderRadius: '16px',
          padding: '30px',
          marginBottom: '30px'
        }}>
          {/* Difficulty Badge */}
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <span style={{
              display: 'inline-block',
              padding: '8px 16px',
              backgroundColor: currentQuestion.difficulty === 'Easy' 
                ? 'rgba(16, 185, 129, 0.2)' 
                : currentQuestion.difficulty === 'Medium' 
                ? 'rgba(245, 158, 11, 0.2)' 
                : 'rgba(239, 68, 68, 0.2)',
              border: `1px solid ${currentQuestion.difficulty === 'Easy' 
                ? 'rgba(16, 185, 129, 0.3)' 
                : currentQuestion.difficulty === 'Medium' 
                ? 'rgba(245, 158, 11, 0.3)' 
                : 'rgba(239, 68, 68, 0.3)'}`,
              borderRadius: '8px',
              color: currentQuestion.difficulty === 'Easy' 
                ? '#10b981' 
                : currentQuestion.difficulty === 'Medium' 
                ? '#f59e0b' 
                : '#ef4444',
              fontSize: '12px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              {currentQuestion.difficulty || 'Medium'} • {(currentQuestion.difficulty || 'Medium') === 'Easy' ? '1' : (currentQuestion.difficulty || 'Medium') === 'Medium' ? '2' : '3'} Point{(currentQuestion.difficulty || 'Medium') !== 'Easy' ? 's' : ''}
            </span>
          </div>
          
          {/* Question Text */}
          <h1 style={{
            fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
            color: 'white',
            marginBottom: '30px',
            lineHeight: '1.3',
            textAlign: 'center',
            fontWeight: '600'
          }}>
            {currentQuestion.question || 'Question text not available'}
          </h1>
          
          {/* Options */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '15px',
            marginBottom: '30px'
          }}>
                         {(currentQuestion.options || []).map((option, index) => {
               const isSelected = selectedAnswer === option;
               const correctAnswer = currentQuestion.answer || currentQuestion.correct;
               const isCorrectOption = option === correctAnswer;
               
               let backgroundColor, borderColor;
               
               if (showResult) {
                 if (isCorrectOption) {
                   backgroundColor = 'rgba(16, 185, 129, 0.3)'; // Green for correct
                   borderColor = '#10b981';
                 } else if (isSelected && !isCorrectOption) {
                   backgroundColor = 'rgba(239, 68, 68, 0.3)'; // Red for wrong selection
                   borderColor = '#ef4444';
                 } else {
                   backgroundColor = 'rgba(34, 211, 238, 0.1)';
                   borderColor = 'rgba(34, 211, 238, 0.2)';
                 }
               } else {
                 backgroundColor = isSelected 
                   ? 'rgba(34, 211, 238, 0.3)' 
                   : 'rgba(34, 211, 238, 0.1)';
                 borderColor = isSelected ? '#22d3ee' : 'rgba(34, 211, 238, 0.2)';
               }
               
               return (
                 <button
                   key={index}
                   onClick={() => !showResult && handleAnswerSelect(option)}
                   disabled={showResult}
                   style={{
                     backgroundColor,
                     border: `1px solid ${borderColor}`,
                  borderRadius: '12px',
                  padding: '15px',
                                       color: 'white',
                     cursor: showResult ? 'default' : 'pointer',
                     textAlign: 'left',
                     minHeight: '60px',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '15px',
                     transition: 'all 0.3s ease',
                     fontSize: '16px',
                     position: 'relative'
                   }}
                   onMouseEnter={(e) => {
                     if (!showResult) {
                       e.target.style.backgroundColor = 'rgba(34, 211, 238, 0.25)';
                       e.target.style.transform = 'translateY(-2px)';
                     }
                   }}
                   onMouseLeave={(e) => {
                     if (!showResult) {
                       e.target.style.backgroundColor = isSelected 
                         ? 'rgba(34, 211, 238, 0.3)' 
                         : 'rgba(34, 211, 238, 0.1)';
                       e.target.style.transform = 'translateY(0)';
                     }
                   }}
                 >
                   <div style={{
                     width: '30px',
                     height: '30px',
                     borderRadius: '50%',
                     backgroundColor: showResult && isCorrectOption ? '#10b981' : showResult && isSelected && !isCorrectOption ? '#ef4444' : '#22d3ee',
                     display: 'flex',
                     alignItems: 'center',
                     justifyContent: 'center',
                     fontSize: '14px',
                     fontWeight: '700',
                     color: 'white',
                     flexShrink: 0
                   }}>
                     {showResult && isCorrectOption ? '✓' : showResult && isSelected && !isCorrectOption ? '✗' : String.fromCharCode(65 + index)}
                   </div>
                   <span style={{ flex: 1 }}>{option}</span>
                 </button>
               );
             })}
                     </div>

           {/* Result Feedback */}
           {showResult && (
             <div style={{
               textAlign: 'center',
               marginBottom: '20px',
               padding: '15px',
               borderRadius: '8px',
               backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
               border: `1px solid ${isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
               color: isCorrect ? '#10b981' : '#ef4444',
               fontSize: '18px',
               fontWeight: '600'
             }}>
               {isCorrect ? '✅ Correct!' : '❌ Incorrect!'}
               {!isCorrect && (
                 <div style={{ marginTop: '8px', fontSize: '16px', fontWeight: '400' }}>
                   The correct answer was: <strong>{currentQuestion.answer || currentQuestion.correct}</strong>
                 </div>
               )}
             </div>
           )}

           {/* Submit/Next Button */}
                      <button 
             onClick={showResult ? handleNext : handleSubmit}
             disabled={!selectedAnswer}
             style={{
               backgroundColor: selectedAnswer ? 'rgba(34, 211, 238, 0.3)' : 'rgba(34, 211, 238, 0.1)',
               border: '2px solid #22d3ee',
               borderRadius: '12px',
               padding: '15px 30px',
               color: 'white',
               cursor: selectedAnswer ? 'pointer' : 'not-allowed',
               fontSize: '16px',
               fontWeight: '700',
               textTransform: 'uppercase',
               letterSpacing: '0.1em',
               margin: '0 auto',
               display: 'block',
               minWidth: '200px',
               opacity: selectedAnswer ? 1 : 0.5,
               transition: 'all 0.3s ease'
             }}
             onMouseEnter={(e) => {
               if (selectedAnswer) {
                 e.target.style.backgroundColor = 'rgba(34, 211, 238, 0.4)';
                 e.target.style.transform = 'translateY(-2px)';
               }
             }}
             onMouseLeave={(e) => {
               if (selectedAnswer) {
                 e.target.style.backgroundColor = 'rgba(34, 211, 238, 0.3)';
                 e.target.style.transform = 'translateY(0)';
               }
             }}
           >
             {showResult 
               ? (currentQuestionIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question')
               : 'Submit Answer'
             }
           </button>
        </div>
      </div>
    </div>
  );
}

export default QuizPageSimple; 