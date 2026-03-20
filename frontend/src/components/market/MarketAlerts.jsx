import React from 'react';
import { motion } from 'framer-motion';
import { Bell, ArrowRight } from 'lucide-react';
import { marketAlerts } from './marketData';

const alertStyles = {
  green: { border: 'border-l-[#78C850]', bg: 'bg-green-50', icon: '🟢', actionClass: 'text-[#2C6E49] bg-green-100 hover:bg-green-200' },
  red: { border: 'border-l-[#C0392B]', bg: 'bg-red-50', icon: '🔴', actionClass: 'text-[#C0392B] bg-red-100 hover:bg-red-200' },
  yellow: { border: 'border-l-[#E8B84B]', bg: 'bg-amber-50', icon: '🟡', actionClass: 'text-[#8B6914] bg-amber-100 hover:bg-amber-200' },
  blue: { border: 'border-l-[#3B82F6]', bg: 'bg-blue-50', icon: '🔵', actionClass: 'text-blue-700 bg-blue-100 hover:bg-blue-200' },
};

const MarketAlerts = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.6 }}
    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6"
  >
    <h2 className="text-xl font-extrabold text-[#1A3C2B] mb-4 flex items-center gap-2">
      <Bell size={22} className="text-[#E8B84B]" /> 🔔 Price Alerts
    </h2>

    <div className="space-y-3">
      {marketAlerts.map((alert, i) => {
        const style = alertStyles[alert.type] || alertStyles.yellow;

        return (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * i }}
            className={`rounded-xl border border-gray-100 border-l-4 ${style.border} ${style.bg} p-3 flex items-center gap-3`}
          >
            <span className="text-2xl shrink-0">{alert.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900">{alert.message}</p>
              <p className="text-xs text-gray-500 mt-0.5">{alert.time}</p>
            </div>
            <button className={`shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors flex items-center gap-1 ${style.actionClass}`}>
              {alert.action} <ArrowRight size={12} />
            </button>
          </motion.div>
        );
      })}
    </div>

    <button className="w-full mt-4 py-2.5 rounded-xl border-2 border-dashed border-[#78C850]/40 text-sm font-bold text-[#2C6E49] hover:bg-[#78C850]/10 transition-colors">
      + Set Custom Alert
    </button>
  </motion.div>
);

export default MarketAlerts;
