import React from 'react';
import { motion } from 'framer-motion';

const NutrientMeter = ({ name, value, icon, description, localName }) => {
    // Determine status based on typical NPK ranges
    // Low: 0-40, Moderate: 40-80, Good: 80+
    const getStatus = (val) => {
        if (val >= 80) return { label: 'Good', color: 'emerald', emoji: '😊' };
        if (val >= 40) return { label: 'OK', color: 'amber', emoji: '😐' };
        return { label: 'Low', color: 'red', emoji: '😟' };
    };

    const status = getStatus(value);
    const percentage = Math.min((value / 100) * 100, 100);

    const colors = {
        emerald: {
            bg: 'bg-emerald-50',
            bar: 'bg-emerald-500',
            text: 'text-emerald-700',
            border: 'border-emerald-200'
        },
        amber: {
            bg: 'bg-amber-50',
            bar: 'bg-amber-500',
            text: 'text-amber-700',
            border: 'border-amber-200'
        },
        red: {
            bg: 'bg-red-50',
            bar: 'bg-red-500',
            text: 'text-red-700',
            border: 'border-red-200'
        }
    };

    const currentColor = colors[status.color];

    return (
        <div className={`p-4 rounded-xl border-2 ${currentColor.border} ${currentColor.bg}`}>
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-2xl">{icon}</span>
                        <div>
                            <h4 className="font-semibold text-gray-900">{name}</h4>
                            {localName && <p className="text-xs text-gray-600">{localName}</p>}
                        </div>
                    </div>
                    <p className="text-xs text-gray-500">{description}</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl mb-1">{status.emoji}</div>
                    <div className={`text-xs font-bold ${currentColor.text}`}>{status.label}</div>
                </div>
            </div>
            
            {/* Progress bar */}
            <div className="relative h-3 bg-white/50 rounded-full overflow-hidden border border-gray-200">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full ${currentColor.bar}`}
                />
            </div>
            
            {/* Value display */}
            <div className="mt-2 text-center">
                <span className="text-sm font-bold text-gray-700">{value}</span>
                <span className="text-xs text-gray-500 ml-1">mg/kg</span>
            </div>
        </div>
    );
};

export default NutrientMeter;
