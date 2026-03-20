import React from 'react';
import { motion } from 'framer-motion';
import { Clock, AlertTriangle, CheckCircle, Bell } from 'lucide-react';
import { centralSchemes } from '../../data/govtSchemes';

const DEADLINES = [
  { schemeId: 'pmfby', label: 'PMFBY Kharif Enrollment', deadline: 'July 31', daysLeft: 3, urgency: 'urgent' },
  { schemeId: 'kcc', label: 'KCC Annual Renewal', deadline: 'Next Month', daysLeft: 22, urgency: 'soon' },
  { schemeId: 'pm-kisan', label: 'PM-KISAN Registration', deadline: 'No deadline', daysLeft: null, urgency: 'open' },
  { schemeId: 'pkvy', label: 'PKVY Cluster Registration', deadline: 'Through local office', daysLeft: null, urgency: 'open' },
  { schemeId: 'soil-health-card', label: 'Soil Health Card', deadline: 'Anytime', daysLeft: null, urgency: 'open' },
  { schemeId: 'e-nam', label: 'e-NAM Registration', deadline: 'Rolling', daysLeft: null, urgency: 'open' },
];

const urgencyConfig = {
  urgent: { bg: 'bg-red-50', border: 'border-l-[#C0392B]', textColor: 'text-[#C0392B]', icon: AlertTriangle, iconColor: 'text-red-500', badge: '🔴 URGENT' },
  soon: { bg: 'bg-amber-50', border: 'border-l-[#E8B84B]', textColor: 'text-[#8B6914]', icon: Clock, iconColor: 'text-amber-500', badge: '🟡 SOON' },
  open: { bg: 'bg-green-50', border: 'border-l-[#78C850]', textColor: 'text-[#2C6E49]', icon: CheckCircle, iconColor: 'text-green-500', badge: '🟢 OPEN' },
};

const DeadlineTracker = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.55 }}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6"
  >
    <h2 className="text-xl font-extrabold text-[#1A3C2B] mb-4 flex items-center gap-2">
      <Clock size={22} className="text-[#E8B84B]" /> ⏰ Important Deadlines
    </h2>

    <div className="space-y-2.5">
      {DEADLINES.map((dl, i) => {
        const cfg = urgencyConfig[dl.urgency];
        const Icon = cfg.icon;
        const scheme = centralSchemes.find(s => s.id === dl.schemeId);

        return (
          <motion.div
            key={dl.schemeId}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}
            className={`${cfg.bg} border border-gray-100 border-l-4 ${cfg.border} rounded-xl p-3 flex items-center gap-3`}
          >
            <Icon size={18} className={cfg.iconColor} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{scheme?.emoji} {dl.label}</p>
              <p className="text-xs text-gray-500">Deadline: {dl.deadline}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {dl.daysLeft !== null ? (
                <span className={`text-sm font-extrabold ${cfg.textColor}`}>
                  {dl.daysLeft} days
                </span>
              ) : (
                <span className="text-xs font-bold text-gray-400">Anytime</span>
              )}
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white border border-gray-200">
                {cfg.badge}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  </motion.div>
);

export default DeadlineTracker;
