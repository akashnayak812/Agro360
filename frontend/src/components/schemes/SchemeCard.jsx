import React from 'react';
import { motion } from 'framer-motion';
import { Phone, ExternalLink, Info, Clock } from 'lucide-react';
import { SCHEME_CATEGORIES } from '../../data/govtSchemes';

const SchemeCard = ({ scheme, index = 0, onClick }) => {
  const cat = SCHEME_CATEGORIES.find(c => c.id === scheme.category) || SCHEME_CATEGORIES[0];
  const hasMoney = scheme.benefitAmount && scheme.benefitAmount > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,0,0,0.10)' }}
      onClick={() => onClick?.(scheme)}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden cursor-pointer transition-all"
      style={{ borderLeftWidth: '4px', borderLeftColor: cat.color }}
      role="button"
      aria-label={`${scheme.name}: ${scheme.benefit}`}
    >
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-start justify-between gap-2"
           style={{ background: `${cat.color}08` }}>
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-2xl shrink-0">{scheme.emoji}</span>
          <div className="min-w-0">
            <h3 className="font-extrabold text-gray-900 text-base truncate">{scheme.name}</h3>
            <p className="text-xs text-gray-500 truncate">{scheme.fullName}</p>
          </div>
        </div>
        <span
          className="shrink-0 text-[10px] font-bold px-2 py-1 rounded-full border"
          style={{ color: cat.color, borderColor: `${cat.color}40`, background: `${cat.color}10` }}
        >
          {cat.emoji} {cat.label}
        </span>
      </div>

      {/* Benefit */}
      <div className="px-4 py-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">💰 Benefit</p>
        <p className={`text-base font-extrabold leading-snug ${hasMoney ? 'text-[#E8B84B]' : 'text-[#2C6E49]'}`}>
          {scheme.benefit}
        </p>
        {scheme.frequency && (
          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
            <Clock size={10} /> {scheme.frequency}
          </p>
        )}
      </div>

      {/* Eligibility preview */}
      <div className="px-4 pb-3">
        <p className="text-xs font-semibold text-gray-500 mb-1.5">✅ Who can apply:</p>
        <ul className="space-y-0.5">
          {scheme.eligibility.slice(0, 2).map((e, i) => (
            <li key={i} className="text-xs text-gray-600 flex items-start gap-1.5">
              <span className="text-[#78C850] mt-0.5">•</span>
              <span className="line-clamp-1">{e}</span>
            </li>
          ))}
          {scheme.eligibility.length > 2 && (
            <li className="text-xs text-gray-400">+{scheme.eligibility.length - 2} more...</li>
          )}
        </ul>
      </div>

      {/* Document chips */}
      <div className="px-4 pb-3">
        <p className="text-xs font-semibold text-gray-500 mb-1.5">📄 Documents:</p>
        <div className="flex flex-wrap gap-1">
          {scheme.documents.slice(0, 3).map((d, i) => (
            <span key={i} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {d}
            </span>
          ))}
          {scheme.documents.length > 3 && (
            <span className="text-[10px] font-medium bg-gray-100 text-gray-400 px-2 py-0.5 rounded-full">
              +{scheme.documents.length - 3}
            </span>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          {scheme.launchedYear && <span>Since {scheme.launchedYear}</span>}
          {scheme.totalBeneficiaries && <span>• {scheme.totalBeneficiaries}</span>}
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href={`tel:${scheme.helpline}`}
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded-full transition-colors"
            aria-label={`Call helpline ${scheme.helpline}`}
          >
            <Phone size={10} /> {scheme.helpline}
          </a>
          <a
            href={scheme.applyLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            className="inline-flex items-center gap-1 text-[10px] font-bold text-[#2C6E49] bg-green-50 hover:bg-green-100 px-2 py-1 rounded-full transition-colors"
            aria-label="Apply online"
          >
            <ExternalLink size={10} /> Apply
          </a>
          <button
            className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50 hover:bg-gray-100 px-2 py-1 rounded-full transition-colors"
            aria-label="View details"
          >
            <Info size={10} /> More
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SchemeCard;
