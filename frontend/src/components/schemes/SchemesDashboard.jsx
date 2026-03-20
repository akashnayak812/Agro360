import React from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ChevronRight, Trash2 } from 'lucide-react';
import { centralSchemes, stateSchemes, getAllSchemes } from '../../data/govtSchemes';

const STATUS_STEPS = [
  { key: 'not_applied', label: 'Not Applied', color: 'bg-gray-300' },
  { key: 'applied', label: 'Applied', color: 'bg-[#E8B84B]' },
  { key: 'under_review', label: 'Under Review', color: 'bg-blue-400' },
  { key: 'approved', label: 'Approved ✅', color: 'bg-[#78C850]' },
];

const SchemesDashboard = ({ savedSchemes, schemeStatuses, onRemove, onStatusChange, onSchemeClick }) => {
  if (!savedSchemes || savedSchemes.length === 0) return null;

  const allSchemes = getAllSchemes();
  const saved = savedSchemes.map(id => allSchemes.find(s => s.id === id)).filter(Boolean);

  const totalClaimed = saved
    .filter(s => schemeStatuses[s.id] === 'approved')
    .reduce((sum, s) => sum + (s.benefitAmount || 0), 0);

  const totalPending = saved
    .filter(s => schemeStatuses[s.id] !== 'approved')
    .reduce((sum, s) => sum + (s.benefitAmount || 0), 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6"
    >
      <h2 className="text-xl font-extrabold text-[#1A3C2B] mb-4 flex items-center gap-2">
        <Bookmark size={22} className="text-[#E8B84B]" /> 📌 Your Schemes Dashboard
      </h2>

      {/* Benefit Tracker */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-green-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 font-medium">Claimed</p>
          <p className="text-xl font-extrabold text-[#2C6E49]">₹{totalClaimed.toLocaleString('en-IN')}</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <p className="text-xs text-gray-500 font-medium">Pending</p>
          <p className="text-xl font-extrabold text-[#8B6914]">₹{totalPending.toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Saved Scheme Cards */}
      <div className="space-y-3">
        {saved.map((scheme) => {
          const currentStatus = schemeStatuses[scheme.id] || 'not_applied';
          const stepIndex = STATUS_STEPS.findIndex(s => s.key === currentStatus);

          return (
            <div key={scheme.id} className="border border-gray-100 rounded-xl p-3">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">{scheme.emoji}</span>
                <span
                  className="font-bold text-sm text-gray-900 flex-1 cursor-pointer hover:text-[#2C6E49]"
                  onClick={() => onSchemeClick?.(scheme)}
                >
                  {scheme.name}
                </span>
                <button
                  onClick={() => onRemove?.(scheme.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Remove from saved"
                >
                  <Trash2 size={14} />
                </button>
              </div>

              {/* Status Tracker */}
              <div className="flex items-center gap-1 mb-2">
                {STATUS_STEPS.map((step, i) => (
                  <React.Fragment key={step.key}>
                    <button
                      onClick={() => onStatusChange?.(scheme.id, step.key)}
                      className={`shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center text-[10px] font-bold transition-all ${
                        i <= stepIndex
                          ? `${step.color} border-transparent text-white`
                          : 'bg-gray-100 border-gray-200 text-gray-400'
                      }`}
                      aria-label={step.label}
                    >
                      {i <= stepIndex ? '✓' : i + 1}
                    </button>
                    {i < STATUS_STEPS.length - 1 && (
                      <div className={`flex-1 h-0.5 ${i < stepIndex ? 'bg-[#78C850]' : 'bg-gray-200'}`} />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-gray-400 px-0.5">
                {STATUS_STEPS.map(s => (
                  <span key={s.key} className={s.key === currentStatus ? 'font-bold text-[#2C6E49]' : ''}>
                    {s.label}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SchemesDashboard;
