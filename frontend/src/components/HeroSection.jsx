import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PlexusBackground = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let particles = [];
        const particleCount = 60; // Slightly reduced for cleaner look
        const connectionDistance = 150;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5; // Slower speed
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1; // Varied size
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                // Bounce off edges
                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)'; // Brighter dots
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw connections first (behind dots)
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < connectionDistance) {
                        ctx.beginPath();
                        // Opacity based on distance
                        const opacity = 1 - distance / connectionDistance;
                        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity * 0.4})`; // Green lines
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }

            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        init();
        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 z-0 pointer-events-none"
        />
    );
};

const HeroSection = ({ isSplash = true }) => {
    const { scrollY } = useScroll();
    const yRange = useTransform(scrollY, [0, 500], [0, 200]);
    const opacityRange = useTransform(scrollY, [0, 300], [1, 0]);

    // Animation Variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                delayChildren: 0.5,
                staggerChildren: 0.2, // Stagger text appearance
                duration: 1.5 // Long fade in
            }
        }
    };

    const textVariants = {
        hidden: { letterSpacing: '-0.5em', opacity: 0, filter: 'blur(10px)' },
        visible: {
            letterSpacing: '0.1em',
            opacity: 1,
            filter: 'blur(0px)',
            transition: { duration: 1.2, ease: "easeOut" } // Elegant expansion
        }
    };

    const subTextVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
    };

    // Floating bokeh particles
    const bokehVariants = {
        animate: {
            y: [0, -20, 0],
            opacity: [0.3, 0.6, 0.3],
            transition: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const rootClasses = isSplash
        ? "fixed inset-0 w-full h-screen z-50 bg-black overflow-hidden"
        : "absolute inset-0 w-full h-full z-0 bg-black overflow-hidden";

    return (
        <div className={rootClasses}>
            {/* Background: Gradient + Plexus */}
            <div className="absolute inset-0 bg-gradient-to-br from-agro-darkGreen via-slate-900 to-black z-0" />

            <PlexusBackground />

            {/* Optional Overlay Gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-0" />

            {/* Bokeh Particles */}
            {[...Array(5)].map((_, i) => (
                <motion.div
                    key={i}
                    variants={bokehVariants}
                    animate="animate"
                    className="absolute rounded-full bg-agro-neon/20 blur-xl"
                    style={{
                        width: Math.random() * 100 + 50,
                        height: Math.random() * 100 + 50,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 2}s`
                    }}
                />
            ))}

            {/* Content Container */}
            <motion.div
                className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
                style={{ y: yRange, opacity: opacityRange }} /* Parallax effect */
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1 className="flex flex-col md:flex-row items-center justify-center gap-4 text-5xl md:text-7xl lg:text-9xl font-bold font-syncopate uppercase tracking-wider text-white">
                    <motion.span variants={textVariants} className="relative">
                        Agro
                    </motion.span>

                    <motion.span
                        variants={textVariants}
                        className="text-transparent bg-clip-text bg-gradient-to-r from-white via-agro-lightGreen to-agro-gold font-lexend relative"
                        style={{
                            textShadow: '0 0 40px rgba(16, 185, 129, 0.6)' // "Aura" Glow
                        }}
                    >
                        360
                        {/* 360 Aura Ring (Pure CSS attempt or keeping it simple with shadow above for now) */}
                    </motion.span>
                </motion.h1>

                <motion.p
                    variants={subTextVariants}
                    className="mt-6 text-lg md:text-xl text-gray-300 font-light max-w-2xl font-lexend tracking-wide"
                >
                    Advanced Disease Detection & <span className="text-agro-neon font-normal">Agricultural Intelligence</span>
                </motion.p>

                <motion.div
                    variants={subTextVariants}
                    className="mt-10"
                >
                    <div className="h-16 w-[1px] bg-gradient-to-b from-transparent via-agro-neon to-transparent mx-auto opacity-50" />
                </motion.div>

            </motion.div>
        </div>
    );
};

export default HeroSection;
