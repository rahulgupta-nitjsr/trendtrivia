import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const StyledCanvas = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: -1;
  background-color: ${({ theme }) => theme.colors.background};
`;

const Background = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const setup = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    let isMobile = window.innerWidth <= 768;
    let planetCount = isMobile ? 4 : 8;
    let starCount = isMobile ? 25 : 50;
    let celestialBodies = [];

    class Planet {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.size = Math.random() * 15 + 8;
        this.opacity = Math.random() * 0.4 + 0.3;
        this.color = Math.random() > 0.5 ? '#22d3ee' : '#a5b4fc';
        this.type = 'planet';
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.color);
        gradient.addColorStop(0.7, this.color + '80');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Star {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.1;
            this.vy = (Math.random() - 0.5) * 0.1;
            this.size = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.8 + 0.2;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }
        draw() {
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = '#E5E7EB'; // Use a theme color
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    const createBodies = () => {
      celestialBodies = [];
      for (let i = 0; i < planetCount; i++) celestialBodies.push(new Planet());
      for (let i = 0; i < starCount; i++) celestialBodies.push(new Star());
    };

    const animateSpace = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      celestialBodies.forEach(body => {
        body.update();
        body.draw();
      });
      animationFrameId = requestAnimationFrame(animateSpace);
    };
    
    const handleResize = () => {
        setup();
        isMobile = window.innerWidth <= 768;
        planetCount = isMobile ? 4 : 8;
        starCount = isMobile ? 25 : 50;
        createBodies();
    };

    setup();
    createBodies();
    animateSpace();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <StyledCanvas ref={canvasRef} />;
};

export default Background; 