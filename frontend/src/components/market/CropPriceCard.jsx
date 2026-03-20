import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// SVG Sparkline from 7 data points
const Sparkline = ({ data, color, width = 80, height = 32 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Area fill */}
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#grad-${color})`}
      />
    </svg>
  );
};

// Count-up for prices
function useCountUp(target, duration = 1000) {
  const [value, setValue] = useState(0);
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

const CropPriceCard = ({ crop, index, onClick }) => {
  const animPrice = useCountUp(crop.currentPrice, 1200);
  const isUp = crop.trend === 'up';
  const trendColor = isUp ? '#78C850' : '#C0392B';
  const isPulse = Math.abs(crop.changePercent) > 5;

  const recColors = {
    SELL_NOW: { bg: 'bg-[#78C850]/15', text: 'text-[#2C6E49]', border: 'border-[#78C850]/30', label: '🟢 SELL NOW', labelFull: 'Good Time to Sell!' },
    WAIT: { bg: 'bg-[#E8B84B]/15', text: 'text-[#8B6914]', border: 'border-[#E8B84B]/30', label: '🟡 WAIT', labelFull: 'Wait for Better Price' },
  };
  const rec = recColors[crop.recommendation] || recColors.WAIT;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      whileHover={{ y: -4, scale: 1.02, boxShadow: '0 12px 32px rgba(0,0,0,0.12)' }}
      onClick={() => onClick?.(crop)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer transition-all relative overflow-hidden"
      role="button"
      aria-label={`${crop.name} at ₹${crop.currentPrice} per ${crop.unit}`}
    >
      {/* Top Row: emoji + name + sparkline */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{crop.emoji}</span>
          <span className="font-bold text-gray-900 text-base">{crop.name}</span>
        </div>
        <Sparkline data={crop.weeklyPrices} color={trendColor} />
      </div>

      {/* Giant Price */}
      <div className="mb-2">
        <span className="text-3xl font-extrabold text-gray-900">
          ₹{animPrice.toLocaleString('en-IN')}
        </span>
        <span className="text-sm text-gray-400 ml-1">/{crop.unit}</span>
      </div>

      {/* Change Badge */}
      <div className="flex items-center gap-2 mb-3">
        <motion.span
          animate={isPulse ? { scale: [1, 1.05, 1] } : {}}
          transition={isPulse ? { repeat: Infinity, duration: 1.5 } : {}}
          className={`inline-flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded-full ${
            isUp ? 'bg-green-50 text-[#2C6E49]' : 'bg-red-50 text-[#C0392B]'
          }`}
        >
          {isUp ? '▲' : '▼'} {isUp ? '+' : ''}₹{crop.change} ({isUp ? '+' : ''}{crop.changePercent}%)
        </motion.span>
        <span className="text-xs text-gray-400">Today</span>
      </div>

      {/* MSP & Min */}
      <div className="flex items-center gap-3 text-xs text-gray-500 mb-3">
        {crop.msp > 0 && (
          <span>MSP: <span className="font-semibold text-gray-700">₹{crop.msp.toLocaleString('en-IN')}</span></span>
        )}
        <span>Low: <span className="font-semibold text-gray-700">₹{crop.minPrice.toLocaleString('en-IN')}</span></span>
        <span>High: <span className="font-semibold text-gray-700">₹{crop.maxPrice.toLocaleString('en-IN')}</span></span>
      </div>

      {/* Demand Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="text-gray-500">Demand</span>
          <span className="font-bold text-gray-700">{crop.demandLevel}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${crop.demandLevel}%` }}
            transition={{ duration: 1, delay: index * 0.05 + 0.3 }}
            className={`h-full rounded-full ${
              crop.demandLevel >= 75 ? 'bg-[#78C850]' : crop.demandLevel >= 50 ? 'bg-[#E8B84B]' : 'bg-[#C0392B]'
            }`}
          />
        </div>
      </div>

      {/* Recommendation Badge */}
      <div className={`text-center py-2 rounded-xl font-bold text-sm ${rec.bg} ${rec.text} border ${rec.border}`}>
        {rec.label}
      </div>
    </motion.div>
  );
};

export default CropPriceCard;
