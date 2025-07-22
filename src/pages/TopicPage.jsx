import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';

const TopicContainer = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing.xlarge} ${({ theme }) => theme.spacing.large};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const BackButton = styled.button`
  ${({ theme }) => theme.glassButton}
  padding: ${({ theme }) => theme.spacing.small} ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadius};
  font-size: ${({ theme }) => theme.fontSizes.small};
  font-family: ${({ theme }) => theme.fonts.main};
  font-weight: 500;
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
  align-self: flex-start;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 40px 0 rgba(34, 211, 238, 0.3);
  }

  .arrow {
    transition: transform 0.2s ease;
  }

  &:hover .arrow {
    transform: translateX(-3px);
  }
`;

const TopicSection = styled.div`
  ${({ theme }) => theme.glass}
  border-radius: ${({ theme }) => theme.borderRadiusXLarge};
  padding: ${({ theme }) => theme.spacing.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
  text-align: center;
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
    background: radial-gradient(circle at 30% 40%, rgba(34, 211, 238, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 70% 80%, rgba(165, 180, 252, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const TopicEmoji = styled.div`
  font-size: 4rem;
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  
  @media (max-width: 768px) {
    font-size: 3rem;
  }
`;

const TopicTitle = styled.h1`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textWhite};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  text-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const TopicDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
`;

const RulesSection = styled.div`
  ${({ theme }) => theme.glass}
  border-radius: ${({ theme }) => theme.borderRadiusLarge};
  padding: ${({ theme }) => theme.spacing.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-weight: 700;
`;

const RulesList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

const RuleItem = styled.li`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.medium};
  background: rgba(31, 41, 55, 0.3);
  border-radius: ${({ theme }) => theme.borderRadius};
  border: 1px solid rgba(34, 211, 238, 0.1);
  transition: all 0.3s ease;

  &:hover {
    background: rgba(31, 41, 55, 0.5);
    border-color: rgba(34, 211, 238, 0.3);
    transform: translateX(5px);
  }
`;

const RuleIcon = styled.div`
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

const RuleText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  font-size: ${({ theme }) => theme.fontSizes.medium};
  line-height: 1.5;
`;

const DurationSection = styled.div`
  ${({ theme }) => theme.glass}
  border-radius: ${({ theme }) => theme.borderRadiusLarge};
  padding: ${({ theme }) => theme.spacing.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const DurationGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.medium};
  }
`;

const DurationCard = styled.button`
  ${({ theme }) => theme.glassButton}
  padding: ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadiusLarge};
  border: 1px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary : 'rgba(34, 211, 238, 0.2)'};
  cursor: pointer;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  
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
    min-height: 100px;
    
    &:hover {
      transform: none;
      box-shadow: 0 8px 32px 0 rgba(34, 211, 238, 0.2);
    }
    
    &:hover::before {
      display: none;
    }
  }
`;

const DurationIcon = styled.div`
  font-size: 2rem;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const DurationTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textWhite};
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

const DurationDesc = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
  margin: 0;
`;

const StartButton = styled.button`
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
  
  &:hover {
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.4) 0%, rgba(34, 211, 238, 0.3) 100%);
    transform: translateY(-3px);
    box-shadow: 0 16px 48px 0 rgba(34, 211, 238, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }
`;

const durations = [
  {
    id: 'week',
    title: 'Last Week',
    icon: '📅',
    description: 'Recent trends and hot topics'
  },
  {
    id: 'month',
    title: 'Last Month',
    icon: '🗓️',
    description: 'Monthly highlights and developments'
  },
  {
    id: 'year',
    title: 'Last Year',
    icon: '📆',
    description: 'Major events and milestones'
  }
];

const topicEmojis = {
  technology: '💻',
  'pop-culture': '🎬',
  finance: '💰',
  startups: '🚀'
};

const topicTitles = {
  technology: 'Technology',
  'pop-culture': 'Pop Culture',
  finance: 'Finance',
  startups: 'Start-ups'
};

function TopicPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedDuration, setSelectedDuration] = useState('month');

  // Get category from URL params
  const urlParams = new URLSearchParams(location.search);
  const category = urlParams.get('category') || 'technology';

  const handleBack = () => {
    navigate('/');
  };

  const handleStartQuiz = () => {
    navigate('/quiz', { 
      state: { 
        topic: topicTitles[category],
        category: category,
        duration: selectedDuration 
      } 
    });
  };

  return (
    <TopicContainer>
      <BackButton onClick={handleBack} className="reveal">
        <span className="arrow">←</span>
        Back to Home
      </BackButton>

      <TopicSection className="reveal">
        <TopicEmoji>{topicEmojis[category]}</TopicEmoji>
        <TopicTitle>{topicTitles[category]} Challenge</TopicTitle>
        <TopicDescription>
          Get ready to test your knowledge on the latest {topicTitles[category].toLowerCase()} trends. 
          Are you up to date with what's happening in this space?
        </TopicDescription>
      </TopicSection>

      <RulesSection className="reveal">
        <SectionTitle>How It Works</SectionTitle>
        <RulesList>
          <RuleItem>
            <RuleIcon>10</RuleIcon>
            <RuleText>Answer 10 carefully curated questions about recent {topicTitles[category].toLowerCase()} trends</RuleText>
          </RuleItem>
          <RuleItem>
            <RuleIcon>⏱️</RuleIcon>
            <RuleText>No time limit - take your time to think through each answer</RuleText>
          </RuleItem>
          <RuleItem>
            <RuleIcon>📊</RuleIcon>
            <RuleText>Questions are weighted by difficulty: Easy (1pt), Medium (2pts), Hard (3pts)</RuleText>
          </RuleItem>
          <RuleItem>
            <RuleIcon>🏆</RuleIcon>
            <RuleText>Get detailed performance analysis and see how you rank</RuleText>
          </RuleItem>
        </RulesList>
      </RulesSection>

      <DurationSection className="reveal">
        <SectionTitle>Choose Your Time Frame</SectionTitle>
        <DurationGrid>
          {durations.map((duration, index) => (
            <DurationCard
              key={duration.id}
              selected={selectedDuration === duration.id}
              onClick={() => setSelectedDuration(duration.id)}
              className="reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <DurationIcon>{duration.icon}</DurationIcon>
              <DurationTitle>{duration.title}</DurationTitle>
              <DurationDesc>{duration.description}</DurationDesc>
            </DurationCard>
          ))}
        </DurationGrid>
        
        <StartButton onClick={handleStartQuiz} className="pulse-glow">
          Start Challenge
        </StartButton>
      </DurationSection>
    </TopicContainer>
  );
}

export default TopicPage; 