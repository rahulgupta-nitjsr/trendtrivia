import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const HomeContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  padding: ${({ theme }) => theme.spacing.xlarge} ${({ theme }) => theme.spacing.large};
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const HeroSection = styled.div`
  ${({ theme }) => theme.glass}
  border-radius: ${({ theme }) => theme.borderRadiusXLarge};
  padding: ${({ theme }) => theme.spacing.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
  text-align: center;
  position: relative;
  overflow: hidden;
  
  /* Floating animation from portfolio */
  animation: floating 6s ease-in-out infinite;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at 20% 50%, rgba(34, 211, 238, 0.05) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(165, 180, 252, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }
`;

const WelcomeText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.large};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
  font-weight: 400;
`;

const MainHeading = styled.h1`
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 700;
  color: ${({ theme }) => theme.colors.textWhite};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  line-height: 1.2;
  text-shadow: 0 0 20px rgba(34, 211, 238, 0.3);
`;

const SubHeading = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.large};
  font-weight: 500;
`;

const Description = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.medium};
  color: ${({ theme }) => theme.colors.textSecondary};
  max-width: 600px;
  margin: 0 auto ${({ theme }) => theme.spacing.xlarge};
  line-height: 1.6;
`;

const TopicsSection = styled.div`
  ${({ theme }) => theme.glass}
  border-radius: ${({ theme }) => theme.borderRadiusXLarge};
  padding: ${({ theme }) => theme.spacing.xlarge};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
`;

const SectionTitle = styled.h2`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  color: ${({ theme }) => theme.colors.primary};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};
  font-weight: 700;
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.large};
  margin-bottom: ${({ theme }) => theme.spacing.xlarge};

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: ${({ theme }) => theme.spacing.medium};
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.large};
  }
`;

const TopicCard = styled.button`
  ${({ theme }) => theme.glassButton}
  padding: ${({ theme }) => theme.spacing.xlarge} ${({ theme }) => theme.spacing.large};
  border-radius: ${({ theme }) => theme.borderRadiusLarge};
  border: 1px solid rgba(34, 211, 238, 0.2);
  cursor: pointer;
  text-align: center;
  position: relative;
  overflow: hidden;
  min-height: 160px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
  
  /* Enhanced hover effects from portfolio */
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &:hover {
    background: linear-gradient(135deg, rgba(34, 211, 238, 0.25) 0%, rgba(34, 211, 238, 0.15) 100%);
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 16px 48px 0 rgba(34, 211, 238, 0.3);
    border-color: rgba(34, 211, 238, 0.4);
  }

  /* Magnetic hover effect */
  &:hover::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(45deg, #22d3ee, #a5b4fc, #22d3ee);
    border-radius: ${({ theme }) => theme.borderRadiusLarge};
    z-index: -1;
    opacity: 0.7;
    animation: rotate-gradient 2s linear infinite;
  }

  @keyframes rotate-gradient {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.large} ${({ theme }) => theme.spacing.medium};
    min-height: 140px;
    
    &:hover {
      transform: none;
      box-shadow: 0 8px 32px 0 rgba(34, 211, 238, 0.2);
    }
    
    &:hover::before {
      display: none;
    }
  }
`;

const TopicEmoji = styled.div`
  font-size: 3rem;
  margin-bottom: ${({ theme }) => theme.spacing.small};
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const TopicTitle = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textWhite};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const TopicDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.4;
  text-align: center;
`;

const StatsSection = styled.div`
  ${({ theme }) => theme.glass}
  border-radius: ${({ theme }) => theme.borderRadiusLarge};
  padding: ${({ theme }) => theme.spacing.large};
  text-align: center;
`;

const HighScore = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

const ScoreLabel = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.small};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const ScoreValue = styled.div`
  font-size: ${({ theme }) => theme.fontSizes.xlarge};
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  text-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
`;

const Quote = styled.div`
  border-top: 1px solid rgba(34, 211, 238, 0.2);
  padding-top: ${({ theme }) => theme.spacing.medium};
  font-style: italic;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.small};
  
  .quote-text {
    margin-bottom: ${({ theme }) => theme.spacing.small};
  }
  
  .quote-author {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: 500;
  }
`;

const topics = [
  {
    id: 'technology',
    title: 'Technology',
    emoji: '💻',
    description: 'Latest tech trends, AI innovations, and digital breakthroughs'
  },
  {
    id: 'pop-culture',
    title: 'Pop Culture',
    emoji: '🎬',
    description: 'Movies, music, celebrities, and entertainment buzz'
  },
  {
    id: 'finance',
    title: 'Finance',
    emoji: '💰',
    description: 'Market trends, crypto, investments, and economic news'
  },
  {
    id: 'startups',
    title: 'Start-ups',
    emoji: '🚀',
    description: 'Entrepreneurship, funding rounds, and startup innovations'
  }
];

function HomePage() {
  const navigate = useNavigate();
  const [highScore, setHighScore] = useState(0);
  const [revealElements, setRevealElements] = useState([]);

  useEffect(() => {
    const savedHighScore = localStorage.getItem('trendtrivia-highscore');
    if (savedHighScore) {
      setHighScore(parseInt(savedHighScore));
    }

    // Reveal animation on scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    const elements = document.querySelectorAll('.reveal');
    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  const handleTopicSelect = (topicId) => {
    navigate(`/topic?category=${topicId}`);
  };

  return (
    <HomeContainer>
      <HeroSection className="reveal">
        <WelcomeText>Welcome to the ultimate trivia challenge</WelcomeText>
        <MainHeading>SO YOU THINK YOU ARE UP TO DATE?</MainHeading>
        <SubHeading>Test Your Knowledge on Latest Trends</SubHeading>
        <Description>
          Challenge yourself with the most current questions across technology, pop culture, 
          finance, and startup ecosystems. Stay sharp, stay informed!
        </Description>
      </HeroSection>

      <TopicsSection className="reveal">
        <SectionTitle>Choose Your Challenge</SectionTitle>
        <TopicsGrid>
          {topics.map((topic, index) => (
            <TopicCard
              key={topic.id}
              onClick={() => handleTopicSelect(topic.id)}
              className="reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <TopicEmoji>{topic.emoji}</TopicEmoji>
              <TopicTitle>{topic.title}</TopicTitle>
              <TopicDescription>{topic.description}</TopicDescription>
            </TopicCard>
          ))}
        </TopicsGrid>
      </TopicsSection>

      <StatsSection className="reveal">
        <HighScore>
          <ScoreLabel>Your Best Performance</ScoreLabel>
          <ScoreValue>{highScore > 0 ? `${highScore}/30` : 'No games played yet'}</ScoreValue>
        </HighScore>
        <Quote>
          <div className="quote-text">
            "The only true wisdom is in knowing you know nothing"
          </div>
          <div className="quote-author">— Socrates</div>
        </Quote>
      </StatsSection>
    </HomeContainer>
  );
}

export default HomePage; 