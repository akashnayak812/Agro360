import React from 'react';
import { motion } from 'framer-motion';
import { Phone } from 'lucide-react';
import { centralSchemes, stateSchemes } from '../../data/govtSchemes';

const HelplineGrid = ({ selectedState }) => {
  const allSchemes = [...centralSchemes, ...(stateSchemes[selectedState] || [])];
  const helplines = allSchemes
    .filter(s => s.helpline)
    .map(s => ({ name: s.name, emoji: s.emoji, helpline: s.helpline }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6"
    >
      <h2 className="text-xl font-extrabold text-[#1A3C2B] mb-2 flex items-center gap-2">
        <Phone size={22} className="text-[#4C9B6E]" /> 📞 Helplines — Quick Reference
      </h2>
      <p className="text-sm text-[#78C850] font-semibold mb-4">✅ All helplines are FREE — call from any phone</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {helplines.map((h, i) => (
          <motion.a
            key={h.name}
            href={`tel:${h.helpline}`}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center gap-3 p-3 bg-gray-50 hover:bg-green-50 border border-gray-200 hover:border-[#78C850] rounded-xl transition-all"
            aria-label={`Call ${h.name} helpline ${h.helpline}`}
          >
            <span className="text-xl">{h.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{h.name}</p>
              <p className="text-xs text-gray-500 font-mono">{h.helpline}</p>
            </div>
            <div className="shrink-0 px-3 py-1.5 bg-[#2C6E49] text-white text-xs font-bold rounded-full">
              📞 Call
            </div>
          </motion.a>
        ))}
      </div>
    </motion.div>
  );
};

export default HelplineGrid;
