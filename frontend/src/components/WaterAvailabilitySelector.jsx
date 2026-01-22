import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

// Water availability options
const WATER_LEVELS = [
    {
        id: 'very_less',
        name: 'Very Less',
        localName: 'बहुत कम / చాలా తక్కువ',
        emoji: '🏜️',
        rainfall: 50,
        color: 'from-orange-500 to-red-500',
        description: 'Drought-like conditions'
    },
    {
        id: 'less',
        name: 'Less',
        localName: 'कम / తక్కువ',
        emoji: '☀️',
        rainfall: 100,
        color: 'from-yellow-500 to-orange-500',
        description: 'Below average rainfall'
    },
    {
        id: 'normal',
        name: 'Normal',
        localName: 'सामान्य / సాధారణ',
        emoji: '🌤️',
        rainfall: 150,
        color: 'from-emerald-400 to-teal-500',
        description: 'Average rainfall'
    },
    {
        id: 'good',
        name: 'Good',
        localName: 'अच्छा / మంచి',
        emoji: '🌧️',
        rainfall: 250,
        color: 'from-blue-400 to-blue-500',
        description: 'Good monsoon'
    },
    {
        id: 'heavy',
        name: 'Heavy',
        localName: 'भारी / భారీ',
        emoji: '🌊',
        rainfall: 400,
        color: 'from-blue-600 to-indigo-600',
        description: 'Heavy rainfall / Flood-prone'
    }
];

const WaterAvailabilitySelector = ({ selected, onSelect }) => {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">💧</span>
                <div>
                    <h3 className="font-semibold text-gray-900">How much water/rain do you get?</h3>
                    <p className="text-sm text-gray-500">आपको कितना पानी/बारिश मिलती है? / మీకు ఎంత నీరు/వర్షం వస్తుంది?</p>
                </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
                {WATER_LEVELS.map((level) => (
                    <motion.button
                        key={level.id}
                        type="button"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSelect(level.id)}
                        className={cn(
                            "relative p-3 rounded-xl border-2 transition-all duration-200",
                            "flex flex-col items-center text-center gap-1",
                            selected === level.id
                                ? "border-emerald-500 bg-emerald-50 shadow-lg"
                                : "border-gray-200 bg-white hover:border-gray-300"
                        )}
                    >
                        {selected === level.id && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center"
                            >
                                <Check size={12} className="text-white" />
                            </motion.div>
                        )}

                        <span className="text-2xl">{level.emoji}</span>
                        <span className="text-xs font-medium text-gray-900">{level.name}</span>
                    </motion.button>
                ))}
            </div>

            {/* Legend */}
            <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                <span>🏜️ Drought</span>
                <span>→</span>
                <span>🌊 Heavy Rain</span>
            </div>
        </div>
    );
};

export default WaterAvailabilitySelector;
export { WATER_LEVELS };
