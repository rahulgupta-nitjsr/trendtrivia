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
    };

    let isMobile = window.innerWidth <= 768;
    let planetCount = isMobile ? 4 : 8;
    let starCount = isMobile ? 25 : 50;
    let shootingStarCount = isMobile ? 1 : 2;
    let celestialBodies = [];
    let shootingStars = [];
    let parallaxOffset = 0;
    let parallaxSpeed = 0.05;

    // Nebula gradient colors
    const nebulaColors = [
      'rgba(34,211,238,0.10)', // cyan
      'rgba(165,180,252,0.12)', // purple
      'rgba(0,191,255,0.10)', // blue
      'rgba(255,255,255,0.05)', // white
    ];

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
        this.parallax = Math.random() * 0.5 + 0.5; // for parallax effect
      }
      update() {
        this.x += this.vx + parallaxOffset * this.parallax;
        this.y += this.vy;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#E5E7EB';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class ShootingStar {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
        this.y = Math.random() * canvas.height * 0.3;
        this.len = Math.random() * 80 + 100;
        this.speed = Math.random() * 8 + 6;
        this.angle = Math.PI / 4 + (Math.random() - 0.5) * 0.2;
        this.opacity = 1;
        this.life = 0;
        this.active = Math.random() > 0.7 ? true : false;
      }
      update() {
        if (!this.active) {
          if (Math.random() < 0.002) this.active = true;
          return;
        }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.life++;
        this.opacity -= 0.012;
        if (this.opacity <= 0 || this.x > canvas.width || this.y > canvas.height) {
          this.reset();
        }
      }
      draw() {
        if (!this.active) return;
        ctx.save();
        ctx.globalAlpha = Math.max(this.opacity, 0);
        ctx.strokeStyle = 'rgba(255,255,255,0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(
          this.x - Math.cos(this.angle) * this.len,
          this.y - Math.sin(this.angle) * this.len
        );
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.restore();
      }
    }

    const drawNebula = () => {
      // Nebula gradient
      const nebula = ctx.createRadialGradient(
        canvas.width * 0.6,
        canvas.height * 0.4,
        canvas.width * 0.1,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.7
      );
      nebula.addColorStop(0, nebulaColors[0]);
      nebula.addColorStop(0.3, nebulaColors[1]);
      nebula.addColorStop(0.6, nebulaColors[2]);
      nebula.addColorStop(1, nebulaColors[3]);
      ctx.save();
      ctx.globalAlpha = 0.7;
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = nebula;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = 'source-over';
      ctx.restore();
    };

    const createBodies = () => {
      celestialBodies = [];
      for (let i = 0; i < planetCount; i++) celestialBodies.push(new Planet());
      for (let i = 0; i < starCount; i++) celestialBodies.push(new Star());
      shootingStars = [];
      for (let i = 0; i < shootingStarCount; i++) shootingStars.push(new ShootingStar());
    };

    const animateSpace = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawNebula();
      celestialBodies.forEach(body => {
        body.update();
        body.draw();
      });
      shootingStars.forEach(star => {
        star.update();
        star.draw();
      });
      parallaxOffset += parallaxSpeed;
      if (parallaxOffset > 2 || parallaxOffset < -2) parallaxSpeed *= -1;
      animationFrameId = requestAnimationFrame(animateSpace);
    };

    const handleResize = () => {
      setup();
      isMobile = window.innerWidth <= 768;
      planetCount = isMobile ? 4 : 8;
      starCount = isMobile ? 25 : 50;
      shootingStarCount = isMobile ? 1 : 2;
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