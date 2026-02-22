import React, { useRef, useEffect } from 'react';

/**
 * AntiGravityCursor Component
 * 
 * Renders a full-screen dynamic network of floating particles.
 * Features:
 * - Floating particles with brownian motion
 * - Anti-gravity repulsion from cursor
 * - Network connections (constellation effect) between nearby particles
 * - Cursor glow and trail
 * 
 * @param {number} particleCount - Number of particles (auto-calculated if not set)
 * @param {number} connectionDistance - Distance to draw lines between particles
 * @param {number} repulsionRadius - Radius of the repulsion effect
 * @param {number} repulsionStrength - Strength of the repulsion force
 * @param {string} particleColor - Color of the particles
 * @param {string} cursorGlowColor - Color of the cursor glow
 */
const AntiGravityCursor = ({
    particleCount = 100, // Number of floating particles
    connectionDistance = 100, // Distance to connect particles
    repulsionRadius = 150,
    repulsionStrength = 2,
    particleColor = 'rgb(0, 255, 0)', // Bright Green (User's choice)
    cursorGlowColor = 'rgb(0, 255, 0)' // Bright Yellow-Green (User's choice)
}) => {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -1000, y: -1000 });
    const trailRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];

        // Helper to get random range
        const random = (min, max) => Math.random() * (max - min) + min;

        // Initialize floating particles
        const initParticles = () => {
            particles = [];
            // Adjust count based on screen size if needed, or use prop
            const count = window.innerWidth < 768 ? 50 : particleCount;

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    vx: random(-0.5, 0.5), // Random drift velocity
                    vy: random(-0.5, 0.5),
                    size: random(1, 3)
                });
            }
        };

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const handleMouseMove = (e) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };

            // Add position to trail
            trailRef.current.push({ x: e.clientX, y: e.clientY, age: 0 });
            if (trailRef.current.length > 20) {
                trailRef.current.shift();
            }
        };

        // Initial setup
        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        handleResize();

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas

            const mouse = mouseRef.current;

            // 1. Draw Network Connections
            ctx.beginPath();
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        // Opacity based on distance
                        const opacity = 1 - (distance / connectionDistance);
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        // We set color in loop for varying opacity, or rely on strokeStyle if constant opacity
                        // For performance, better to batch lines of similar opacity, but here we keep it simple or use global alpha
                    }
                }
            }
            ctx.strokeStyle = particleColor.replace('0.6', '0.15'); // Faint lines
            ctx.lineWidth = 0.5;
            ctx.stroke();


            // 2. Update and Draw Particles
            particles.forEach(p => {
                // Calculate distance to cursor
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Repulsion Force
                if (distance < repulsionRadius) {
                    const force = (1 - distance / repulsionRadius) * repulsionStrength;
                    const angle = Math.atan2(dy, dx);
                    p.vx += Math.cos(angle) * force;
                    p.vy += Math.sin(angle) * force;
                }

                // Apply constant drift + friction
                p.x += p.vx;
                p.y += p.vy;

                // Friction to stabilize speed
                p.vx *= 0.95;
                p.vy *= 0.95;

                // Add small randomness to keep them moving if stopped
                p.vx += random(-0.02, 0.02);
                p.vy += random(-0.02, 0.02);

                // Screen Wrap-around
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Draw Particle
                ctx.fillStyle = particleColor;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // 3. Draw Cursor Trail & Glow
            // Update trail age
            trailRef.current.forEach(p => p.age++);
            trailRef.current = trailRef.current.filter(p => p.age < 20);

            // Draw Trail
            if (trailRef.current.length > 1) {
                ctx.beginPath();
                ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
                for (let i = 1; i < trailRef.current.length; i++) {
                    const p = trailRef.current[i];
                    ctx.lineTo(p.x, p.y);
                }
                ctx.lineCap = 'round';
                ctx.lineWidth = 2;
                ctx.strokeStyle = cursorGlowColor;
                ctx.stroke();
            }

            // Draw Glow
            if (mouse.x > 0 && mouse.y > 0) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, repulsionRadius * 0.5);
                gradient.addColorStop(0, cursorGlowColor);
                gradient.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(mouse.x, mouse.y, repulsionRadius * 0.5, 0, Math.PI * 2);
                ctx.fill();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, [particleCount, connectionDistance, repulsionRadius, repulsionStrength, particleColor, cursorGlowColor]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-50 mix-blend-screen"
        />
    );
};

export default AntiGravityCursor;
