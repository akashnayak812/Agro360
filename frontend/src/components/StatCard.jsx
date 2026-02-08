import React from 'react';
import { motion } from 'framer-motion';

const StatCard = ({ title, value, icon: Icon, trend, color, delay = 0 }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
            className={`relative overflow-hidden bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-${color}-100 shadow-lg hover:shadow-xl transition-all duration-300 group`}
        >
            <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                <Icon size={80} className={`text-${color}-500 transform rotate-12`} />
            </div>

            <div className="relative z-10 flex flex-col justify-between h-full">
                <div className="flex items-center gap-3 mb-4">
                    <div className={`p-3 rounded-xl bg-${color}-50 text-${color}-600`}>
                        <Icon size={24} />
                    </div>
                    <h3 className="text-gray-500 font-medium text-sm">{title}</h3>
                </div>

                <div>
                    <h4 className="text-3xl font-bold text-gray-900 mb-1">{value}</h4>
                    {trend && (
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${trend > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {trend > 0 ? '+' : ''}{trend}% from last month
                        </span>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default StatCard;
