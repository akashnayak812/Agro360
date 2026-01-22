import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

// Visual soil type options with images and descriptions
const SOIL_TYPES = [
    {
        id: 'black_sticky',
        name: 'Black Soil',
        localName: 'काली मिट्टी / నల్ల మట్టి',
        emoji: '⬛',
        color: 'from-gray-800 to-gray-900',
        borderColor: 'border-gray-700',
        selectedBg: 'bg-gray-800',
        description: 'Dark, sticky when wet, cracks when dry',
        localDesc: 'गीला होने पर चिपचिपा, सूखने पर दरारें',
        crops: ['Cotton', 'Wheat', 'Jowar', 'Sunflower'],
        image: '🌑'
    },
    {
        id: 'red_sandy',
        name: 'Red Soil',
        localName: 'लाल मिट्टी / ఎర్ర మట్టి',
        emoji: '🟤',
        color: 'from-red-700 to-red-800',
        borderColor: 'border-red-600',
        selectedBg: 'bg-red-700',
        description: 'Reddish, sandy, drains water fast',
        localDesc: 'लाल रंग, रेतीली, पानी जल्दी सोखती है',
        crops: ['Groundnut', 'Millets', 'Pulses'],
        image: '🔴'
    },
    {
        id: 'brown_loamy',
        name: 'Brown Loamy',
        localName: 'दोमट मिट्टी / గోధుమ మట్టి',
        emoji: '🟫',
        color: 'from-amber-700 to-amber-800',
        borderColor: 'border-amber-600',
        selectedBg: 'bg-amber-700',
        description: 'Brown, soft, holds water well',
        localDesc: 'भूरी, मुलायम, पानी रोकती है',
        crops: ['Rice', 'Vegetables', 'Sugarcane'],
        image: '🟤'
    },
    {
        id: 'yellow_clay',
        name: 'Yellow/Laterite',
        localName: 'पीली मिट्टी / పసుపు మట్టి',
        emoji: '🟡',
        color: 'from-yellow-600 to-yellow-700',
        borderColor: 'border-yellow-500',
        selectedBg: 'bg-yellow-600',
        description: 'Yellowish, hard when dry, acidic',
        localDesc: 'पीली, सूखने पर कड़ी, अम्लीय',
        crops: ['Tea', 'Coffee', 'Cashew'],
        image: '🟡'
    },
    {
        id: 'alluvial',
        name: 'River Soil',
        localName: 'नदी मिट्टी / ఒండ్రు మట్టి',
        emoji: '🩶',
        color: 'from-slate-500 to-slate-600',
        borderColor: 'border-slate-400',
        selectedBg: 'bg-slate-500',
        description: 'Near rivers, very fertile, grayish',
        localDesc: 'नदियों के पास, बहुत उपजाऊ, धूसर',
        crops: ['Rice', 'Wheat', 'Sugarcane', 'Vegetables'],
        image: '🌊'
    }
];

const SimpleSoilSelector = ({ selected, onSelect, showDetails = true }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">🪨</span>
                <div>
                    <h3 className="font-semibold text-gray-900">What does your soil look like?</h3>
                    <p className="text-sm text-gray-500">आपकी मिट्टी कैसी दिखती है? / మీ మట్టి ఎలా కనిపిస్తుంది?</p>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {SOIL_TYPES.map((soil) => (
                    <motion.button
                        key={soil.id}
                        type="button"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => onSelect(soil.id)}
                        className={cn(
                            "relative p-4 rounded-xl border-2 transition-all duration-200",
                            "flex flex-col items-center text-center gap-2",
                            "hover:shadow-lg",
                            selected === soil.id
                                ? `${soil.borderColor} ${soil.selectedBg} text-white shadow-lg`
                                : "border-gray-200 bg-white hover:border-gray-300"
                        )}
                    >
                        {/* Selection indicator */}
                        {selected === soil.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center shadow-md"
                            >
                                <Check size={14} className="text-white" />
                            </motion.div>
                        )}

                        {/* Soil color indicator */}
                        <div className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center text-2xl",
                            `bg-gradient-to-br ${soil.color}`
                        )}>
                            {soil.image}
                        </div>

                        {/* Name */}
                        <div className="space-y-0.5">
                            <p className={cn(
                                "font-medium text-sm",
                                selected === soil.id ? "text-white" : "text-gray-900"
                            )}>
                                {soil.name}
                            </p>
                            <p className={cn(
                                "text-xs",
                                selected === soil.id ? "text-white/80" : "text-gray-500"
                            )}>
                                {soil.localName.split(' / ')[0]}
                            </p>
                        </div>
                    </motion.button>
                ))}
            </div>

            {/* Selected soil details */}
            {showDetails && selected && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-4 p-4 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border border-emerald-200"
                >
                    {(() => {
                        const soil = SOIL_TYPES.find(s => s.id === selected);
                        return soil ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{soil.image}</span>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{soil.name}</h4>
                                        <p className="text-sm text-gray-600">{soil.description}</p>
                                        <p className="text-xs text-gray-500">{soil.localDesc}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="text-xs font-medium text-gray-700">Best crops:</span>
                                    {soil.crops.map(crop => (
                                        <span
                                            key={crop}
                                            className="px-2 py-1 bg-white rounded-full text-xs text-emerald-700 border border-emerald-200"
                                        >
                                            {crop}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ) : null;
                    })()}
                </motion.div>
            )}
        </div>
    );
};

export default SimpleSoilSelector;
export { SOIL_TYPES };
