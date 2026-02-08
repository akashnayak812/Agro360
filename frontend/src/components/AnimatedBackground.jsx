import React from 'react';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-agro-beam">
            {/* Base Gradient - Morning Sky feel */}
            <div className="absolute inset-0 bg-gradient-to-br from-agro-sun-light/30 via-agro-water-light/20 to-agro-leaf-light/10" />

            {/* Sun Glow */}
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.4, 0.6, 0.4],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-20 -right-20 h-[600px] w-[600px] rounded-full bg-agro-sun/20 blur-[120px]"
            />

            {/* Green Fields Bloom */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, 50, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-20 -left-20 h-[500px] w-[500px] rounded-full bg-agro-leaf-light/20 blur-[100px]"
            />

            {/* Water/Sky Drift */}
            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, -70, 0],
                    y: [0, 50, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute top-1/2 left-1/3 h-[600px] w-[600px] rounded-full bg-agro-water-light/30 blur-[100px]"
            />

            {/* Floating Organic Particles (Leaves/Pollen) */}
            <div className="absolute inset-0">
                {[...Array(15)].map((_, i) => (
                    <motion.div
                        key={i}
                        className={`absolute rounded-full ${i % 2 === 0 ? 'bg-agro-leaf/20' : 'bg-agro-gold/20'}`}
                        style={{
                            width: Math.random() * 6 + 4 + 'px',
                            height: Math.random() * 6 + 4 + 'px',
                            left: Math.random() * 100 + '%',
                            top: Math.random() * 100 + '%',
                        }}
                        animate={{
                            y: [0, -100],
                            x: [0, Math.random() * 50 - 25],
                            opacity: [0, 0.8, 0],
                        }}
                        transition={{
                            duration: Math.random() * 15 + 15,
                            repeat: Infinity,
                            ease: "linear",
                            delay: Math.random() * 10,
                        }}
                    />
                ))}
            </div>

            {/* Subtle Grid for "Smart Farming" Tech Feel */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.03)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30" />
        </div>
    );
};

export default AnimatedBackground;
