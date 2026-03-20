import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, MapPin, Zap, Star } from 'lucide-react';
import { cropMarketData, nearbyMandis } from './marketData';

// Count-up hook
function useCountUp(target, duration = 1200) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return value;
}

const StatCard = ({ icon: Icon, iconColor, borderColor, bgGradient, title, children, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
    className={`bg-white rounded-2xl shadow-sm border-l-4 ${borderColor} p-4 sm:p-5 cursor-pointer transition-shadow`}
  >
    <div className="flex items-start gap-3">
      <div className={`p-2.5 rounded-xl ${bgGradient}`}>
        <Icon size={22} className={iconColor} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">{title}</p>
        {children}
      </div>
    </div>
  </motion.div>
);

const QuickStatsRow = () => {
  const bestCrop = cropMarketData.reduce((best, c) => c.changePercent > best.changePercent ? c : best, cropMarketData[0]);
  const avgPrice = Math.round(cropMarketData.reduce((s, c) => s + c.currentPrice, 0) / cropMarketData.length);
  const avgChange = Math.round(cropMarketData.reduce((s, c) => s + c.change, 0) / cropMarketData.length);
  const topMandi = nearbyMandis.filter(m => m.isOpen).sort((a, b) => a.distance - b.distance)[0];
  const bestDeal = cropMarketData.reduce((best, c) => c.demandLevel > best.demandLevel && c.recommendation === 'SELL_NOW' ? c : best, cropMarketData[0]);

  const animAvg = useCountUp(avgPrice);
  const animBest = useCountUp(bestCrop.currentPrice);
  const animDeal = useCountUp(bestDeal.currentPrice);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Best Crop */}
      <StatCard
        icon={TrendingUp} iconColor="text-[#4C9B6E]"
        borderColor="border-[#78C850]" bgGradient="bg-green-50"
        title="Best Crop to Sell" delay={0.1}
      >
        <p className="text-2xl sm:text-3xl font-extrabold text-[#2C6E49] leading-none">
          {bestCrop.emoji} {bestCrop.name}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          ₹{animBest.toLocaleString('en-IN')}/qtl · <span className="text-[#78C850] font-bold">+{bestCrop.changePercent}%</span>
        </p>
      </StatCard>

      {/* Average Price */}
      <StatCard
        icon={Star} iconColor="text-[#E8B84B]"
        borderColor="border-[#E8B84B]" bgGradient="bg-amber-50"
        title="Average Price" delay={0.2}
      >
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-none">
          ₹{animAvg.toLocaleString('en-IN')}
        </p>
        <p className="text-xs mt-1">
          <span className={`font-bold ${avgChange >= 0 ? 'text-[#78C850]' : 'text-[#C0392B]'}`}>
            {avgChange >= 0 ? '+' : ''}₹{avgChange} {avgChange >= 0 ? '↑' : '↓'}
          </span>
          <span className="text-gray-400"> vs yesterday</span>
        </p>
      </StatCard>

      {/* Nearest Active Mandi */}
      <StatCard
        icon={MapPin} iconColor="text-blue-600"
        borderColor="border-blue-500" bgGradient="bg-blue-50"
        title="Nearest Open Mandi" delay={0.3}
      >
        <p className="text-lg font-extrabold text-gray-900 leading-tight truncate">
          {topMandi?.name || 'N/A'}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">
            {topMandi?.distance} km
          </span>
          <span className="text-xs text-gray-400">{topMandi?.hours}</span>
        </div>
      </StatCard>

      {/* Best Deal */}
      <StatCard
        icon={Zap} iconColor="text-[#E8B84B]"
        borderColor="border-[#E8B84B]" bgGradient="bg-yellow-50"
        title="Today's Best Deal" delay={0.4}
      >
        <p className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-none">
          {bestDeal.emoji} ₹{animDeal.toLocaleString('en-IN')}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-gray-500">{bestDeal.name}</span>
          <span className="text-xs bg-[#E8B84B]/20 text-[#B8860B] font-bold px-2 py-0.5 rounded-full">
            ⚡ Limited Window
          </span>
        </div>
      </StatCard>
    </div>
  );
};

export default QuickStatsRow;
