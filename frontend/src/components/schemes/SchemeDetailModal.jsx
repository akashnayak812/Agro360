import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Phone, Share2, Bookmark, BookmarkCheck, MessageCircle, ChevronRight } from 'lucide-react';
import { SCHEME_CATEGORIES } from '../../data/govtSchemes';
import AISchemeHelper from './AISchemeHelper';

const TABS = [
  { id: 'overview', label: 'Overview', emoji: '📋' },
  { id: 'apply', label: 'How to Apply', emoji: '📝' },
  { id: 'ai', label: 'AI Help', emoji: '🤖' },
  { id: 'share', label: 'Share & Save', emoji: '📤' },
];

const SchemeDetailModal = ({ scheme, onClose, savedSchemes = [], onToggleSave }) => {
  const [activeTab, setActiveTab] = useState('overview');
  if (!scheme) return null;

  const cat = SCHEME_CATEGORIES.find(c => c.id === scheme.category) || SCHEME_CATEGORIES[0];
  const isSaved = savedSchemes.includes(scheme.id);

  const shareOnWhatsApp = () => {
    const msg = `🌾 *Government Scheme Alert*\n\nScheme: *${scheme.name}*\nBenefit: *${scheme.benefit}*\nWho: ${scheme.eligibility[0]}\n\n📱 Apply here: ${scheme.applyLink}\n📞 Free helpline: ${scheme.helpline}\n\nShared via Agro360 App 🌱`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.92, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.92, opacity: 0, y: 30 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          onClick={e => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-5 pt-5 pb-3 flex items-start gap-3" style={{ background: `${cat.color}08` }}>
            <span className="text-4xl mt-0.5">{scheme.emoji}</span>
            <div className="flex-1 min-w-0">
              <h2 className="text-xl font-extrabold text-[#1A3C2B] leading-tight">{scheme.name}</h2>
              <p className="text-sm text-gray-500">{scheme.fullName}</p>
              <p className="text-xs text-gray-400 mt-0.5">{scheme.ministry}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors shrink-0"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100 px-5">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-bold border-b-2 transition-all ${
                  activeTab === tab.id
                    ? 'border-[#2C6E49] text-[#2C6E49]'
                    : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
              >
                <span>{tab.emoji}</span>
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-5">
            {/* Overview */}
            {activeTab === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-5">
                {/* Benefit */}
                <div className="bg-[#F5F2E8] rounded-2xl p-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">💰 What You Get</p>
                  <p className="text-lg font-extrabold text-[#E8B84B]">{scheme.benefit}</p>
                  {scheme.frequency && <p className="text-xs text-gray-500 mt-0.5">{scheme.frequency}</p>}
                </div>

                {/* Eligibility */}
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-2">✅ Who Can Apply</p>
                  <ul className="space-y-1.5">
                    {scheme.eligibility.map((e, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-[#78C850] mt-0.5 shrink-0">✓</span>
                        {e}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Ineligible */}
                {scheme.ineligible && scheme.ineligible.length > 0 && (
                  <div>
                    <p className="text-sm font-bold text-gray-700 mb-2">❌ Cannot Apply If</p>
                    <ul className="space-y-1.5">
                      {scheme.ineligible.map((e, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-500">
                          <span className="text-[#C0392B] mt-0.5 shrink-0">✗</span>
                          {e}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Documents */}
                <div>
                  <p className="text-sm font-bold text-gray-700 mb-2">📄 Documents Needed</p>
                  <div className="flex flex-wrap gap-2">
                    {scheme.documents.map((d, i) => (
                      <span key={i} className="inline-flex items-center gap-1 text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full">
                        📎 {d}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Premium info for insurance */}
                {scheme.premium && (
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="text-sm font-bold text-blue-800 mb-2">💳 Premium Rates</p>
                    <div className="grid grid-cols-3 gap-2">
                      {Object.entries(scheme.premium).map(([season, rate]) => (
                        <div key={season} className="text-center">
                          <p className="text-xs text-blue-600 capitalize font-medium">{season}</p>
                          <p className="text-sm font-bold text-blue-900">{rate}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* How to Apply */}
            {activeTab === 'apply' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                <div className="space-y-3">
                  {scheme.howToApply.map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-3"
                    >
                      <div className="shrink-0 w-8 h-8 rounded-full bg-[#2C6E49] text-white flex items-center justify-center text-sm font-bold">
                        {i + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-sm font-medium text-gray-700">{step}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Deadline */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mt-4">
                  <p className="text-sm font-bold text-amber-800">⏰ Deadline: {scheme.deadline}</p>
                </div>

                {/* Apply Button */}
                <a
                  href={scheme.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3.5 bg-[#78C850] hover:bg-[#6ab842] text-white font-bold text-base rounded-xl shadow-lg shadow-green-200 transition-colors"
                >
                  Apply Now on Official Website <ExternalLink size={16} className="inline ml-1" />
                </a>

                {/* Helpline */}
                <a
                  href={`tel:${scheme.helpline}`}
                  className="block w-full text-center py-3 border-2 border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Phone size={16} className="inline mr-1" /> Call Free Helpline: {scheme.helpline}
                </a>
              </motion.div>
            )}

            {/* AI Help */}
            {activeTab === 'ai' && (
              <AISchemeHelper scheme={scheme} />
            )}

            {/* Share & Save */}
            {activeTab === 'share' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                <button
                  onClick={() => onToggleSave?.(scheme.id)}
                  className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all ${
                    isSaved
                      ? 'border-[#78C850] bg-green-50 text-[#2C6E49]'
                      : 'border-gray-200 hover:border-[#78C850] text-gray-700'
                  }`}
                >
                  {isSaved ? <BookmarkCheck size={22} /> : <Bookmark size={22} />}
                  <div className="text-left">
                    <p className="font-bold">{isSaved ? 'Saved to My Schemes ✅' : 'Save to My Schemes'}</p>
                    <p className="text-xs text-gray-500">Track your application status</p>
                  </div>
                </button>

                <button
                  onClick={shareOnWhatsApp}
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-green-400 hover:bg-green-50 transition-all text-gray-700"
                >
                  <span className="text-2xl">📱</span>
                  <div className="text-left">
                    <p className="font-bold">Share on WhatsApp</p>
                    <p className="text-xs text-gray-500">Send to family & friends</p>
                  </div>
                  <ChevronRight size={18} className="ml-auto text-gray-400" />
                </button>

                <a
                  href={scheme.applyLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all text-gray-700"
                >
                  <ExternalLink size={22} />
                  <div className="text-left">
                    <p className="font-bold">Visit Official Website</p>
                    <p className="text-xs text-gray-500">{scheme.applyLink}</p>
                  </div>
                  <ChevronRight size={18} className="ml-auto text-gray-400" />
                </a>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SchemeDetailModal;
