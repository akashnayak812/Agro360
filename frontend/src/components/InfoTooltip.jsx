import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const InfoTooltip = ({ title, content, localTitle }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-blue-500 hover:text-blue-600 transition-colors"
            >
                <HelpCircle size={16} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/20 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Tooltip */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: -10 }}
                            className="absolute left-0 top-6 z-50 w-80 max-w-sm"
                        >
                            <div className="bg-white rounded-xl shadow-2xl border-2 border-blue-100 p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-gray-900">{title}</h4>
                                        {localTitle && (
                                            <p className="text-xs text-gray-600">{localTitle}</p>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="text-gray-400 hover:text-gray-600"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                                <div className="text-sm text-gray-700 leading-relaxed">
                                    {content}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InfoTooltip;
