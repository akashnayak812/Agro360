import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, SlidersHorizontal, X, TrendingUp, TrendingDown, Volume2 } from 'lucide-react';

// Import sub-components
import MarketHeroHeader from './market/MarketHeroHeader';
import QuickStatsRow from './market/QuickStatsRow';
import CropPriceCard from './market/CropPriceCard';
import PriceTrendChart from './market/PriceTrendChart';
import MandiList from './market/MandiList';
import SeasonalCalendar from './market/SeasonalCalendar';
import MarketAlerts from './market/MarketAlerts';
import LiveMandiSearch from './LiveMandiSearch';

// Import data
import { cropMarketData, CATEGORIES } from './market/marketData';

/* ─── Sparkline mini-chart for modal ─── */
const ModalSparkline = ({ data, color, width = 200, height = 60 }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 8) - 4;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id="modal-spark-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill="url(#modal-spark-grad)"
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Dots */}
      {data.map((v, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - ((v - min) / range) * (height - 8) - 4;
        return <circle key={i} cx={x} cy={y} r="3" fill={color} stroke="#fff" strokeWidth="1.5" />;
      })}
    </svg>
  );
};

/* ─── Crop Detail Modal ─── */
const CropDetailModal = ({ crop, onClose }) => {
  if (!crop) return null;

  const isUp = crop.trend === 'up';
  const trendColor = isUp ? '#78C850' : '#C0392B';
  const recConfig = {
    SELL_NOW: { bg: 'bg-[#78C850]/15', text: 'text-[#2C6E49]', border: 'border-[#78C850]/40', icon: '🟢', label: 'Good Time to Sell!', desc: 'Prices are above average. Selling now can maximise your profit.' },
    WAIT: { bg: 'bg-[#E8B84B]/15', text: 'text-[#8B6914]', border: 'border-[#E8B84B]/40', icon: '🟡', label: 'Wait for Better Price', desc: 'Prices may rise. Hold your stock for a better return.' },
  };
  const rec = recConfig[crop.recommendation] || recConfig.WAIT;

  const speakCrop = () => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const text = `${crop.name} is currently priced at ${crop.currentPrice} rupees per ${crop.unit}. The price has ${isUp ? 'increased' : 'decreased'} by ${Math.abs(crop.change)} rupees today. ${crop.recommendation === 'SELL_NOW' ? 'It is a good time to sell.' : 'Consider waiting for a better price.'}`;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 relative overflow-hidden"
          onClick={e => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Close details"
          >
            <X size={18} />
          </button>

          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-5xl">{crop.emoji}</span>
            <div>
              <h2 className="text-2xl font-extrabold text-[#1A3C2B]">{crop.name}</h2>
              <p className="text-sm text-gray-500">{crop.category} · {crop.season.join(', ')}</p>
            </div>
            <button
              onClick={speakCrop}
              className="ml-auto p-2.5 rounded-xl bg-[#F5F2E8] hover:bg-[#E8B84B]/20 transition-colors"
              aria-label="Read aloud"
            >
              <Volume2 size={20} className="text-[#8B6914]" />
            </button>
          </div>

          {/* Price */}
          <div className="bg-[#F5F2E8] rounded-2xl p-5 mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Today's Price</p>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-extrabold text-[#1A3C2B]">
                ₹{crop.currentPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-gray-500 pb-1">per {crop.unit}</span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className={`inline-flex items-center gap-1 text-sm font-bold px-2.5 py-1 rounded-full ${isUp ? 'bg-green-100 text-[#2C6E49]' : 'bg-red-100 text-[#C0392B]'}`}>
                {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {isUp ? '+' : ''}₹{crop.change} ({isUp ? '+' : ''}{crop.changePercent}%)
              </span>
              <span className="text-xs text-gray-400">vs yesterday</span>
            </div>
          </div>

          {/* 7-Day Trend Chart */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">7-Day Price Trend</p>
            <ModalSparkline data={crop.weeklyPrices} color={trendColor} />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {crop.msp > 0 && (
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs text-gray-500">MSP</p>
                <p className="text-lg font-bold text-gray-900">₹{crop.msp.toLocaleString('en-IN')}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Low</p>
              <p className="text-lg font-bold text-gray-900">₹{crop.minPrice.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">High</p>
              <p className="text-lg font-bold text-gray-900">₹{crop.maxPrice.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3">
              <p className="text-xs text-gray-500">Demand</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-bold text-gray-900">{crop.demandLevel}%</p>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${crop.demandLevel >= 75 ? 'bg-[#78C850]' : crop.demandLevel >= 50 ? 'bg-[#E8B84B]' : 'bg-[#C0392B]'}`}
                    style={{ width: `${crop.demandLevel}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recommendation */}
          <div className={`rounded-2xl p-4 ${rec.bg} border ${rec.border}`}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{rec.icon}</span>
              <span className={`text-lg font-extrabold ${rec.text}`}>{rec.label}</span>
            </div>
            <p className={`text-sm ${rec.text} opacity-80`}>{rec.desc}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

/* ─── Sort Options ─── */
const SORT_OPTIONS = [
  { value: 'price_desc', label: 'Highest Price' },
  { value: 'change_desc', label: 'Biggest Rise' },
  { value: 'az', label: 'A → Z' },
];

/* ─── Section Wrapper With Stagger ─── */
const Section = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
const MarketInsights = () => {
  // State selector (passed to hero header)
  const [selectedState, setSelectedState] = useState('Telangana');

  // Crop grid controls
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('price_desc');

  // Modal
  const [selectedCrop, setSelectedCrop] = useState(null);

  // Filtered + sorted crops
  const filteredCrops = useMemo(() => {
    let crops = [...cropMarketData];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      crops = crops.filter(c => c.name.toLowerCase().includes(q));
    }

    // Category
    if (activeCategory !== 'All') {
      crops = crops.filter(c => c.category === activeCategory);
    }

    // Sort
    switch (sortBy) {
      case 'price_desc':
        crops.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'change_desc':
        crops.sort((a, b) => b.changePercent - a.changePercent);
        break;
      case 'az':
        crops.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return crops;
  }, [searchQuery, activeCategory, sortBy]);

  const handleCardClick = useCallback((crop) => setSelectedCrop(crop), []);
  const handleCloseModal = useCallback(() => setSelectedCrop(null), []);

  return (
    <div className="min-h-screen" style={{ background: '#F5F2E8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">

        {/* ═══ SECTION 1 — Hero Header ═══ */}
        <Section delay={0}>
          <MarketHeroHeader
            selectedState={selectedState}
            onStateChange={setSelectedState}
          />
        </Section>

        {/* ═══ SECTION 1.5 — Live APMC Mandi Search ═══ */}
        <Section delay={0.05} className="mt-8 mb-8">
          <LiveMandiSearch />
        </Section>

        {/* ═══ SECTION 2 — Quick Stats Row ═══ */}
        <Section delay={0.1}>
          <QuickStatsRow />
        </Section>

        {/* ═══ SECTION 3 — Crop Price Cards Grid ═══ */}
        <Section delay={0.2}>
          <div className="mb-6">
            {/* Controls Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-5">
              {/* Search */}
              <div className="relative max-w-sm w-full">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search crop..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:ring-2 focus:ring-[#78C850]/50 focus:border-[#78C850] outline-none transition-all shadow-sm"
                  aria-label="Search crops"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={16} className="text-gray-400" />
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-[#78C850]/50 cursor-pointer shadow-sm"
                  aria-label="Sort crops"
                >
                  {SORT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 mb-5">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                    activeCategory === cat
                      ? 'bg-[#2C6E49] text-white shadow-md shadow-green-200'
                      : 'bg-white text-gray-600 border border-gray-200 hover:border-[#78C850] hover:text-[#2C6E49]'
                  }`}
                  aria-label={`Filter by ${cat}`}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Crop Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <AnimatePresence mode="popLayout">
                {filteredCrops.map((crop, i) => (
                  <motion.div
                    key={crop.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CropPriceCard
                      crop={crop}
                      index={i}
                      onClick={handleCardClick}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Empty State */}
            {filteredCrops.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <span className="text-4xl mb-3 block">🔍</span>
                <p className="text-gray-500 font-medium">No crops found for "{searchQuery}"</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                  className="mt-3 text-sm font-bold text-[#2C6E49] hover:underline"
                >
                  Clear filters
                </button>
              </motion.div>
            )}
          </div>
        </Section>

        {/* ═══ SECTION 4 — Price Trend Chart ═══ */}
        <Section delay={0.3}>
          <PriceTrendChart />
        </Section>

        {/* ═══ SECTION 5 — Nearby Mandis ═══ */}
        <Section delay={0.4}>
          <MandiList />
        </Section>

        {/* ═══ SECTION 6 — Seasonal Calendar ═══ */}
        <Section delay={0.5}>
          <SeasonalCalendar />
        </Section>

        {/* ═══ SECTION 7 — Market Alerts ═══ */}
        <Section delay={0.6}>
          <MarketAlerts />
        </Section>

      </div>

      {/* ─── Crop Detail Modal ─── */}
      {selectedCrop && (
        <CropDetailModal crop={selectedCrop} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default MarketInsights;
