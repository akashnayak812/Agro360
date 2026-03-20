import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Clock, Navigation, ExternalLink } from 'lucide-react';
import { nearbyMandis } from './marketData';

const MandiCard = ({ mandi, index }) => {
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${mandi.lat},${mandi.lng}`;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`bg-white rounded-2xl shadow-sm border border-gray-100 p-4 border-l-4 ${
        mandi.isOpen ? 'border-l-[#78C850]' : 'border-l-[#C0392B]'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 text-base truncate">{mandi.name}</h3>
          <p className="text-xs text-gray-500">{mandi.city}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
            mandi.isOpen
              ? 'bg-green-50 text-[#2C6E49] border border-green-200'
              : 'bg-red-50 text-[#C0392B] border border-red-200'
          }`}>
            {mandi.isOpen ? '● Open' : '● Closed'}
          </span>
          <span className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full border border-blue-200">
            {mandi.distance} km
          </span>
        </div>
      </div>

      {/* Top Crops */}
      <div className="space-y-1.5 mb-3">
        {mandi.topCrops.map((crop, i) => (
          <div key={i} className="flex items-center justify-between text-sm">
            <span className="text-gray-600">
              <span className="mr-1">{crop.emoji}</span> {crop.crop}
            </span>
            <span className="font-bold text-gray-900">₹{crop.price.toLocaleString('en-IN')}/qtl</span>
          </div>
        ))}
      </div>

      {/* Hours + Directions */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={12} />
          <span>{mandi.hours}</span>
        </div>
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#2C6E49] hover:text-[#78C850] transition-colors"
        >
          <Navigation size={12} /> Get Directions <ExternalLink size={10} />
        </a>
      </div>
    </motion.div>
  );
};

// Simple map placeholder with pulsing markers
const MapPlaceholder = () => (
  <div className="relative bg-[#F5F2E8] rounded-2xl border border-gray-200 overflow-hidden h-full min-h-[280px]">
    {/* Grid pattern */}
    <div className="absolute inset-0 opacity-20" style={{
      backgroundImage: 'linear-gradient(#2C6E49 1px, transparent 1px), linear-gradient(90deg, #2C6E49 1px, transparent 1px)',
      backgroundSize: '30px 30px'
    }} />

    {/* Center marker (farmer) */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
      <div className="relative">
        <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
        <div className="absolute inset-0 w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-50" />
      </div>
      <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[10px] font-bold text-blue-700 whitespace-nowrap bg-white/80 px-1.5 py-0.5 rounded">
        📍 You
      </span>
    </div>

    {/* Mandi markers */}
    {nearbyMandis.map((mandi, i) => {
      const positions = [
        { top: '20%', left: '70%' },
        { top: '30%', left: '25%' },
        { top: '65%', left: '15%' },
        { top: '75%', left: '65%' },
        { top: '40%', left: '80%' }
      ];
      const pos = positions[i] || positions[0];

      return (
        <div key={mandi.id} className="absolute z-10" style={pos}>
          <div className={`w-3 h-3 rounded-full border-2 border-white shadow ${
            mandi.isOpen ? 'bg-[#78C850]' : 'bg-[#C0392B]'
          }`} />
          <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 text-[9px] font-semibold text-gray-600 whitespace-nowrap bg-white/80 px-1 rounded">
            {mandi.city}
          </span>
        </div>
      );
    })}

    {/* Label */}
    <div className="absolute bottom-3 left-3 text-xs text-gray-500 flex items-center gap-1.5">
      <MapPin size={12} /> Nearby Mandis
    </div>
  </div>
);

const MandiList = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    className="mb-6"
  >
    <h2 className="text-xl font-extrabold text-[#1A3C2B] mb-4 flex items-center gap-2">
      <MapPin size={22} className="text-[#4C9B6E]" /> Nearby Mandis
    </h2>

    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
      {/* Mandi Cards — 3 cols */}
      <div className="lg:col-span-3 space-y-3">
        {nearbyMandis.map((mandi, i) => (
          <MandiCard key={mandi.id} mandi={mandi} index={i} />
        ))}
      </div>

      {/* Map — 2 cols */}
      <div className="lg:col-span-2">
        <MapPlaceholder />
      </div>
    </div>
  </motion.div>
);

export default MandiList;
