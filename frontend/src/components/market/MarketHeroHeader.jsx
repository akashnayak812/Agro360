import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, ChevronDown } from 'lucide-react';
import { cropMarketData, INDIAN_STATES } from './marketData';

const MarketHeroHeader = ({ selectedState, onStateChange }) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Build ticker items from crop data
  const tickerItems = cropMarketData.slice(0, 8).map(c => ({
    emoji: c.emoji,
    name: c.name,
    price: c.currentPrice,
    change: c.change,
    up: c.trend === 'up'
  }));

  const doubled = [...tickerItems, ...tickerItems];

  return (
    <div className="rounded-2xl overflow-hidden mb-6">
      {/* Main Header Bar */}
      <div className="bg-gradient-to-r from-[#1A3C2B] via-[#2C6E49] to-[#1A3C2B] px-4 sm:px-6 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Left */}
          <div className="flex items-center gap-3">
            <span className="text-3xl">🌾</span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Market Prices Today
            </h1>
          </div>

          {/* Center — Date & Time */}
          <div className="hidden sm:flex flex-col items-center">
            <span className="text-white/90 text-sm font-semibold">
              {time.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-[#78C850] text-xs font-mono font-bold">
              {time.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>

          {/* Right — Location Selector */}
          <div className="relative">
            <div className="flex items-center gap-2 bg-[#78C850]/20 border border-[#78C850]/40 rounded-full px-4 py-2 cursor-pointer">
              <MapPin size={16} className="text-[#78C850]" />
              <select
                value={selectedState}
                onChange={e => onStateChange(e.target.value)}
                className="bg-transparent text-white text-sm font-medium appearance-none outline-none cursor-pointer pr-4"
                aria-label="Select State"
              >
                {INDIAN_STATES.map(s => (
                  <option key={s} value={s} className="bg-[#1A3C2B] text-white">{s}</option>
                ))}
              </select>
              <ChevronDown size={14} className="text-[#78C850] -ml-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Ticker Tape */}
      <div className="bg-[#0F2B1E] overflow-hidden relative h-10">
        <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-[#0F2B1E] to-transparent z-10" />
        <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-[#0F2B1E] to-transparent z-10" />
        <div className="flex items-center h-full animate-ticker whitespace-nowrap">
          {doubled.map((item, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-4 text-sm">
              <span>{item.emoji}</span>
              <span className="text-white/80 font-medium">{item.name}</span>
              <span className="text-white font-bold">₹{item.price.toLocaleString('en-IN')}</span>
              <span className={`font-bold ${item.up ? 'text-[#78C850]' : 'text-[#C0392B]'}`}>
                {item.up ? '▲' : '▼'} {item.up ? '+' : ''}{item.change}
              </span>
              <span className="text-white/20 mx-2">│</span>
            </span>
          ))}
        </div>
      </div>

      {/* Ticker CSS */}
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker {
          animation: tickerScroll 30s linear infinite;
        }
        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default MarketHeroHeader;
