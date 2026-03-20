import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { seasonalData } from './marketData';

const SeasonalCalendar = () => {
  const scrollRef = useRef(null);
  const currentMonth = new Date().getMonth(); // 0-indexed

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 200, behavior: 'smooth' });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-extrabold text-[#1A3C2B] flex items-center gap-2">
          <Calendar size={22} className="text-[#4C9B6E]" /> Best Time to Sell
        </h2>
        <div className="flex gap-1">
          <button onClick={() => scroll(-1)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Scroll left">
            <ChevronLeft size={16} />
          </button>
          <button onClick={() => scroll(1)} className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors" aria-label="Scroll right">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div ref={scrollRef} className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {seasonalData.map((month, i) => {
          const isCurrent = i === currentMonth;

          return (
            <motion.div
              key={month.month}
              whileHover={{ y: -2 }}
              className={`shrink-0 w-28 sm:w-32 rounded-2xl border-2 p-3 transition-all text-center ${
                isCurrent
                  ? 'bg-[#2C6E49] border-[#78C850] text-white shadow-lg shadow-green-200'
                  : 'bg-gray-50 border-gray-200 hover:border-[#78C850]'
              }`}
            >
              <p className={`text-sm font-extrabold mb-2 ${isCurrent ? 'text-white' : 'text-gray-900'}`}>
                {month.month}
              </p>
              <div className="flex justify-center gap-1 text-xl mb-2">
                {month.crops.map((emoji, j) => <span key={j}>{emoji}</span>)}
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                isCurrent
                  ? 'bg-white/20 text-white border border-white/30'
                  : month.label.includes('Harvest') || month.label.includes('Peak')
                    ? 'bg-green-100 text-green-800 border border-green-200'
                    : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                {month.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </motion.div>
  );
};

export default SeasonalCalendar;
