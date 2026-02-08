import React from 'react';
import { motion } from 'framer-motion';

const NutrientMeter = ({ name, value, icon, description, localName, max = 200 }) => {
    // value is mg/kg (ppm)
    // Ranges:
    // N: Low < 280, Med 280-560, High > 560 (approx) - let's adjust for demo
    // P: Low < 10, Med 10-25, High > 25
    // K: Low < 108, Med 108-280, High > 280
    // Simplified specific ranges per nutrient for better visuals can be complex, 
    // so we stick to a generalized "Health" heuristic for 0-100 scale if value is normalized,
    // or just use value directly. 
    // Let's assume input value is somewhat normalized or raw. 
    // For this UI, let's map 'value' to a percentage of 'max'.

    const percentage = Math.min((value / max) * 100, 100);

    const getStatus = (val, m) => {
        const pct = (val / m) * 100;
        if (pct >= 70) return { label: 'Good', color: '#10B981', bg: 'bg-emerald-50', text: 'text-emerald-700' };
        if (pct >= 40) return { label: 'Medium', color: '#F59E0B', bg: 'bg-amber-50', text: 'text-amber-700' };
        return { label: 'Low', color: '#EF4444', bg: 'bg-red-50', text: 'text-red-700' };
    };

    const status = getStatus(value, max);
    const radius = 30; // Radius of the circle
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-2xl border ${status.bg.replace('bg-', 'border-').replace('50', '200')} ${status.bg} flex items-center gap-4`}
        >
            {/* Circular Gauge */}
            <div className="relative w-20 h-20 flex-shrink-0 flex items-center justify-center">
                <svg className="transform -rotate-90 w-full h-full">
                    <circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke="currentColor"
                        strokeWidth="8"
                        fill="transparent"
                        className="text-gray-200"
                    />
                    <motion.circle
                        cx="40"
                        cy="40"
                        r={radius}
                        stroke={status.color}
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-xl">
                    {icon}
                </div>
            </div>

            <div className="flex-1">
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="font-bold text-gray-900 text-lg leading-none">{name}</h4>
                        {localName && <p className="text-xs text-gray-600 mt-1 font-medium">{localName}</p>}
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full bg-white/60 ${status.text} border border-white`}>
                        {status.label}
                    </span>
                </div>

                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{description}</p>

                <div className="mt-2 flex items-baseline gap-1">
                    <span className="text-2xl font-bold text-gray-800">{value}</span>
                    <span className="text-xs text-gray-500 font-medium">units</span>
                </div>
            </div>
        </motion.div>
    );
};

export default NutrientMeter;

