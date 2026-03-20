import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend, CartesianGrid } from 'recharts';
import { cropMarketData, generatePriceHistory } from './marketData';

const COLORS = ['#2C6E49', '#E8B84B', '#C0392B', '#3B82F6'];
const TIME_RANGES = [
  { label: '7 Days', days: 7 },
  { label: '1 Month', days: 30 },
  { label: '3 Months', days: 90 },
  { label: '1 Year', days: 365 },
];

const PriceTrendChart = () => {
  const [selectedCrops, setSelectedCrops] = useState(['Rice', 'Wheat']);
  const [timeRange, setTimeRange] = useState(30);

  const toggleCrop = (name) => {
    setSelectedCrops(prev => {
      if (prev.includes(name)) return prev.filter(n => n !== name);
      if (prev.length >= 3) return prev;
      return [...prev, name];
    });
  };

  // Generate chart data
  const chartData = useMemo(() => {
    const crops = selectedCrops.map(name => cropMarketData.find(c => c.name === name)).filter(Boolean);
    if (crops.length === 0) return [];

    const histories = crops.map(c => ({ name: c.name, data: generatePriceHistory(c, timeRange), msp: c.msp }));

    // Merge all histories by date
    const merged = histories[0].data.map((point, i) => {
      const entry = { date: point.date };
      histories.forEach(h => {
        entry[h.name] = h.data[i]?.price || 0;
        entry[`${h.name}_msp`] = h.msp;
      });
      return entry;
    });

    return merged;
  }, [selectedCrops, timeRange]);

  // Get MSP for reference line (first selected crop)
  const firstCrop = cropMarketData.find(c => c.name === selectedCrops[0]);
  const showMSP = firstCrop && firstCrop.msp > 0;

  // Insight text
  const insightCrop = firstCrop;
  const insightText = insightCrop
    ? insightCrop.trend === 'up'
      ? `${insightCrop.name} prices have risen ${Math.abs(insightCrop.changePercent)}% recently — good time to sell!`
      : `${insightCrop.name} prices are declining ${Math.abs(insightCrop.changePercent)}% — consider waiting.`
    : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 mb-6"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-extrabold text-[#1A3C2B]">📈 Price History</h2>
          <p className="text-sm text-gray-500 mt-0.5">Compare up to 3 crops</p>
        </div>

        {/* Time Range Pills */}
        <div className="flex gap-2">
          {TIME_RANGES.map(t => (
            <button
              key={t.days}
              onClick={() => setTimeRange(t.days)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                timeRange === t.days
                  ? 'bg-[#2C6E49] text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Crop Selector */}
      <div className="flex flex-wrap gap-2 mb-4">
        {cropMarketData.map(c => (
          <button
            key={c.name}
            onClick={() => toggleCrop(c.name)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
              selectedCrops.includes(c.name)
                ? 'bg-[#2C6E49] text-white border-[#2C6E49]'
                : 'bg-white text-gray-600 border-gray-200 hover:border-[#78C850]'
            } ${selectedCrops.length >= 3 && !selectedCrops.includes(c.name) ? 'opacity-40 cursor-not-allowed' : ''}`}
            disabled={selectedCrops.length >= 3 && !selectedCrops.includes(c.name)}
          >
            {c.emoji} {c.name}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 11, fill: '#999' }}
              interval={Math.max(0, Math.floor(chartData.length / 8))}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#999' }}
              tickFormatter={v => `₹${v}`}
              width={60}
            />
            <Tooltip
              contentStyle={{
                background: '#fff',
                border: '1px solid #E5E7EB',
                borderRadius: '12px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                fontSize: '12px'
              }}
              formatter={(value, name) => [`₹${value.toLocaleString('en-IN')}`, name]}
            />
            <Legend
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
            {showMSP && (
              <ReferenceLine
                y={firstCrop.msp}
                stroke="#E8B84B"
                strokeDasharray="6 4"
                label={{ value: `MSP ₹${firstCrop.msp}`, position: 'right', fontSize: 10, fill: '#E8B84B' }}
              />
            )}
            {selectedCrops.map((name, i) => (
              <Line
                key={name}
                type="monotone"
                dataKey={name}
                stroke={COLORS[i]}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, strokeWidth: 2, fill: '#fff', stroke: COLORS[i] }}
                animationDuration={1500}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Insight */}
      {insightText && (
        <div className="mt-4 p-3 bg-[#F5F2E8] rounded-xl border border-[#E8B84B]/20">
          <p className="text-sm text-[#1A3C2B] font-medium">
            💡 {insightText}
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default PriceTrendChart;
