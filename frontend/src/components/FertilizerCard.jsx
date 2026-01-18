import React from 'react';
import { motion } from 'framer-motion';

const FertilizerCard = ({ type, description, localName, benefits }) => {
    const typeColors = {
        'Urea': { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700', icon: '🌿' },
        'DAP': { bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700', icon: '🌺' },
        'MOP': { bg: 'bg-orange-50', border: 'border-orange-200', text: 'text-orange-700', icon: '💪' },
        'NPK': { bg: 'bg-purple-50', border: 'border-purple-200', text: 'text-purple-700', icon: '🌱' },
        'Compost': { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', icon: '🍂' }
    };

    // Find matching color scheme or use default
    const colorScheme = Object.keys(typeColors).find(key => type.includes(key)) 
        ? typeColors[Object.keys(typeColors).find(key => type.includes(key))]
        : typeColors['NPK'];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-2xl border-2 ${colorScheme.border} ${colorScheme.bg}`}
        >
            <div className="flex items-start gap-4">
                <div className="text-5xl">{colorScheme.icon}</div>
                <div className="flex-1">
                    <h3 className={`text-2xl font-bold ${colorScheme.text} mb-1`}>{type}</h3>
                    {localName && (
                        <p className="text-sm text-gray-600 mb-3">{localName}</p>
                    )}
                    <p className="text-gray-700 leading-relaxed mb-4">{description}</p>
                    
                    {benefits && benefits.length > 0 && (
                        <div className="space-y-2">
                            <h4 className="text-sm font-semibold text-gray-700">Benefits (लाभ):</h4>
                            <ul className="space-y-1">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                                        <span className="text-green-500">✓</span>
                                        <span>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default FertilizerCard;
