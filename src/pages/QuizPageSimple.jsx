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
  const [hoveredOption, setHoveredOption] = useState(null);

  const { topic, category, duration } = location.state || { topic: 'Technology', category: 'technology', duration: 'month' };

  // Map frontend duration values to backend timeframe values
  const mapDurationToTimeframe = (duration) => {
    const durationMap = {
      'week': 'last_week',
      'month': 'last_month', 
      'year': 'last_year'
    };
    return durationMap[duration] || 'last_month'; // Default to last_month
  };

  const timeframe = mapDurationToTimeframe(duration);

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    setIsLoading(true);
    
    console.log('🎯 QuizPageSimple - Loading questions with:', {
      category,
      duration,
      timeframe,
      topic
    });
    console.log('🔍 Exact parameters being sent to Firebase:', {
      count: 10,
      category: category,
      timeframe: timeframe,
      'category type': typeof category,
      'timeframe type': typeof timeframe
    });
    
    try {
      console.log('🔍 About to call getQuizQuestions...');
      const result = await getQuizQuestions({ 
        count: 10, 
        category: category,
        timeframe: timeframe
      });
      console.log('📦 getQuizQuestions result:', result);
      
      if (result.success && result.questions.length > 0) {
        setQuestions(result.questions);
        console.log(`✅ Loaded ${result.questions.length} questions from database`, {
          category,
          timeframe,
          duration,
          source: result.metadata?.source || 'unknown',
          batchId: result.metadata?.batchId || 'none'
        });
      } else {
        console.warn('⚠️ Firebase query failed or returned no questions:', {
          success: result.success,
          questionsLength: result.questions?.length || 0,
          result: result
        });
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
      console.error('❌ Error loading questions:', error);
      console.error('❌ Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
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
      setHoveredOption(null); // Reset hover state
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

      {/* Timeframe Indicator */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        padding: '8px 16px',
        backgroundColor: 'rgba(165, 180, 252, 0.2)',
        border: '1px solid rgba(165, 180, 252, 0.3)',
        borderRadius: '20px',
        color: '#a5b4fc',
        fontSize: '12px',
        fontWeight: '500',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}>
        {duration === 'week' && '📅 Last Week'}
        {duration === 'month' && '🗓️ Last Month'}  
        {duration === 'year' && '📆 Last Year'}
      </div>

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
               
               // Determine button styling based on state
               const isHovered = hoveredOption === index;
               let backgroundColor = 'rgba(34, 211, 238, 0.1)'; // Default background
               let borderColor = 'rgba(34, 211, 238, 0.2)'; // Default border
               let boxShadow = 'none';
               let transform = 'translateY(0)';
               
               if (showResult) {
                 // After answer is submitted
                 if (isCorrectOption) {
                   backgroundColor = 'rgba(16, 185, 129, 0.3)'; // Green for correct answer
                   borderColor = '#10b981';
                   boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
                 } else if (isSelected && !isCorrectOption) {
                   backgroundColor = 'rgba(239, 68, 68, 0.3)'; // Red for wrong selection
                   borderColor = '#ef4444';
                   boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                 } else {
                   backgroundColor = 'rgba(55, 65, 81, 0.3)'; // Neutral for unselected
                   borderColor = 'rgba(107, 114, 128, 0.3)';
                 }
               } else {
                 // Before answer is submitted
                 if (isHovered && !showResult) {
                   backgroundColor = 'rgba(34, 211, 238, 0.25)'; // Hover state
                   borderColor = '#22d3ee';
                   boxShadow = '0 6px 16px rgba(34, 211, 238, 0.4)';
                   transform = 'translateY(-2px)';
                 } else if (isSelected) {
                   backgroundColor = 'rgba(34, 211, 238, 0.3)'; // Selected state
                   borderColor = '#22d3ee';
                   boxShadow = '0 4px 12px rgba(34, 211, 238, 0.3)';
                 } else {
                   backgroundColor = 'rgba(34, 211, 238, 0.1)'; // Default unselected
                   borderColor = 'rgba(34, 211, 238, 0.2)';
                 }
               }
               
               return (
                 <button
                   key={index}
                   onClick={() => !showResult && handleAnswerSelect(option)}
                   disabled={showResult}
                   style={{
                     backgroundColor: backgroundColor,
                     border: `2px solid ${borderColor}`,
                     borderRadius: '12px',
                     padding: '20px',
                     color: 'white',
                     cursor: showResult ? 'default' : 'pointer',
                     textAlign: 'left',
                     minHeight: '70px',
                     display: 'flex',
                     alignItems: 'center',
                     gap: '15px',
                     transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                     fontSize: '16px',
                     fontWeight: '500',
                     position: 'relative',
                     outline: 'none',
                     boxShadow: boxShadow,
                     transform: transform,
                     // Comprehensive background reset
                     backgroundImage: 'none',
                     backgroundRepeat: 'no-repeat',
                     backgroundAttachment: 'scroll',
                     backgroundClip: 'border-box',
                     backgroundOrigin: 'padding-box',
                     backgroundSize: 'auto',
                     backgroundPosition: '0% 0%',
                     // Browser appearance reset
                     WebkitAppearance: 'none',
                     MozAppearance: 'none',
                     appearance: 'none',
                     // Force background color to override any inherited styles
                     backgroundBlendMode: 'normal',
                     isolation: 'isolate'
                   }}
                   onMouseEnter={() => !showResult && setHoveredOption(index)}
                   onMouseLeave={() => !showResult && setHoveredOption(null)}
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