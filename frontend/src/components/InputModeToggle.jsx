import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';

const InputModeToggle = ({ mode, onModeChange }) => {
    return (
        <div className="flex items-center justify-center gap-2 p-1 bg-gray-100 rounded-xl">
            <motion.button
                type="button"
                onClick={() => onModeChange('simple')}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                    mode === 'simple'
                        ? "bg-white shadow-md text-emerald-600"
                        : "text-gray-500 hover:text-gray-700"
                )}
                whileTap={{ scale: 0.98 }}
            >
                <Sparkles size={18} />
                <span className="font-medium">Simple</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                    Easy
                </span>
            </motion.button>

            <motion.button
                type="button"
                onClick={() => onModeChange('advanced')}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200",
                    mode === 'advanced'
                        ? "bg-white shadow-md text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                )}
                whileTap={{ scale: 0.98 }}
            >
                <Settings2 size={18} />
                <span className="font-medium">Advanced</span>
            </motion.button>
        </div>
    );
};

export default InputModeToggle;
