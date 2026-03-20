import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Landmark, ChevronDown, Star, Award } from 'lucide-react';

// Sub-components
import SchemeCard from './schemes/SchemeCard';
import EligibilityChecker from './schemes/EligibilityChecker';
import CategoryFilter from './schemes/CategoryFilter';
import SchemeSearchBar from './schemes/SchemeSearchBar';
import SchemeDetailModal from './schemes/SchemeDetailModal';
import SchemesDashboard from './schemes/SchemesDashboard';
import DeadlineTracker from './schemes/DeadlineTracker';
import HelplineGrid from './schemes/HelplineGrid';

// Data
import {
  centralSchemes,
  stateSchemes,
  INDIAN_STATES,
  SCHEME_CATEGORIES,
  getAllSchemes,
} from '../data/govtSchemes';

/* ─── Section wrapper with staggered fade-in ─── */
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
const GovtSchemes = () => {
  // State
  const [selectedState, setSelectedState] = useState('Telangana');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedScheme, setSelectedScheme] = useState(null);

  // Saved schemes (localStorage)
  const [savedSchemes, setSavedSchemes] = useState(() => {
    try { return JSON.parse(localStorage.getItem('agro360_saved_schemes') || '[]'); }
    catch { return []; }
  });
  const [schemeStatuses, setSchemeStatuses] = useState(() => {
    try { return JSON.parse(localStorage.getItem('agro360_scheme_statuses') || '{}'); }
    catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem('agro360_saved_schemes', JSON.stringify(savedSchemes));
  }, [savedSchemes]);

  useEffect(() => {
    localStorage.setItem('agro360_scheme_statuses', JSON.stringify(schemeStatuses));
  }, [schemeStatuses]);

  const toggleSave = useCallback((id) => {
    setSavedSchemes(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  }, []);

  const updateStatus = useCallback((id, status) => {
    setSchemeStatuses(prev => ({ ...prev, [id]: status }));
  }, []);

  const removeSaved = useCallback((id) => {
    setSavedSchemes(prev => prev.filter(s => s !== id));
    setSchemeStatuses(prev => { const n = { ...prev }; delete n[id]; return n; });
  }, []);

  // Current state schemes
  const currentStateSchemes = stateSchemes[selectedState] || [];

  // Combined for filtering
  const allDisplaySchemes = useMemo(() => {
    return [...centralSchemes, ...currentStateSchemes];
  }, [currentStateSchemes]);

  // Category counts
  const schemeCounts = useMemo(() => {
    const counts = {};
    allDisplaySchemes.forEach(s => {
      counts[s.category] = (counts[s.category] || 0) + 1;
    });
    return counts;
  }, [allDisplaySchemes]);

  // Filtered schemes
  const filteredCentral = useMemo(() => {
    let schemes = [...centralSchemes];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      schemes = schemes.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        s.benefit.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q))
      );
    }
    if (activeCategory !== 'all') {
      schemes = schemes.filter(s => s.category === activeCategory);
    }
    return schemes;
  }, [searchQuery, activeCategory]);

  const filteredState = useMemo(() => {
    let schemes = [...currentStateSchemes];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      schemes = schemes.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.fullName.toLowerCase().includes(q) ||
        s.benefit.toLowerCase().includes(q) ||
        s.tags.some(t => t.includes(q))
      );
    }
    if (activeCategory !== 'all') {
      schemes = schemes.filter(s => s.category === activeCategory);
    }
    return schemes;
  }, [currentStateSchemes, searchQuery, activeCategory]);

  const handleCardClick = useCallback((scheme) => setSelectedScheme(scheme), []);
  const handleCloseModal = useCallback(() => setSelectedScheme(null), []);

  // Top 3 schemes for hero floating cards
  const topSchemes = centralSchemes.filter(s => s.benefitAmount).sort((a, b) => b.benefitAmount - a.benefitAmount).slice(0, 3);

  return (
    <div className="min-h-screen" style={{ background: '#F5F2E8' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-12">

        {/* ═══ SECTION 1 — Hero Banner ═══ */}
        <Section delay={0}>
          <div className="rounded-2xl overflow-hidden mb-6 bg-gradient-to-r from-[#1A3C2B] via-[#2C6E49] to-[#1A3C2B] relative">
            {/* Pattern overlay */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'radial-gradient(circle, #fff 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }} />

            <div className="relative px-5 sm:px-8 py-8 flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Left */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl">🏛️</span>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    Government Schemes for Farmers
                  </h1>
                </div>
                <p className="text-white/80 text-base mb-4">
                  All benefits you deserve — in one place. Simple. Clear. Farmer-friendly.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 text-white text-sm font-bold px-3 py-1.5 rounded-full">
                    <Award size={14} /> {centralSchemes.length + Object.values(stateSchemes).flat().length}+ Schemes Available
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#E8B84B]/20 border border-[#E8B84B]/30 text-[#E8B84B] text-sm font-bold px-3 py-1.5 rounded-full">
                    <Star size={14} /> ₹50,000+ Benefits Per Farmer
                  </span>
                </div>
              </div>

              {/* Right — Floating top scheme cards */}
              <div className="hidden lg:flex flex-col gap-2 w-56">
                {topSchemes.map((s, i) => (
                  <motion.div
                    key={s.id}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 3, delay: i * 0.5 }}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-3 py-2 text-white"
                  >
                    <span className="text-lg mr-1.5">{s.emoji}</span>
                    <span className="text-sm font-bold">{s.name}</span>
                    {s.benefitAmount > 0 && (
                      <span className="float-right text-sm font-extrabold text-[#E8B84B]">
                        ₹{s.benefitAmount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* State Selector Bar */}
            <div className="bg-[#0F2B1E] px-5 sm:px-8 py-3 flex items-center gap-3">
              <span className="text-white/80 text-sm font-medium">Showing schemes for:</span>
              <div className="relative">
                <select
                  value={selectedState}
                  onChange={e => setSelectedState(e.target.value)}
                  className="bg-[#78C850]/20 border border-[#78C850]/40 rounded-full px-4 py-1.5 text-white text-sm font-bold appearance-none outline-none cursor-pointer pr-8"
                  aria-label="Select state"
                >
                  {INDIAN_STATES.map(s => (
                    <option key={s} value={s} className="bg-[#1A3C2B] text-white">{s}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#78C850] pointer-events-none" />
              </div>
            </div>
          </div>
        </Section>

        {/* ═══ SECTION 2 — Eligibility Checker ═══ */}
        <Section delay={0.1}>
          <EligibilityChecker onSchemeClick={handleCardClick} />
        </Section>

        {/* ═══ My Schemes Dashboard (if any saved) ═══ */}
        {savedSchemes.length > 0 && (
          <Section delay={0.15}>
            <SchemesDashboard
              savedSchemes={savedSchemes}
              schemeStatuses={schemeStatuses}
              onRemove={removeSaved}
              onStatusChange={updateStatus}
              onSchemeClick={handleCardClick}
            />
          </Section>
        )}

        {/* ═══ SECTION 3 — Search & Filters ═══ */}
        <Section delay={0.2}>
          <SchemeSearchBar query={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
            schemeCounts={schemeCounts}
          />
        </Section>

        {/* ═══ SECTION 4 — Central Schemes ═══ */}
        <Section delay={0.25}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🇮🇳</span>
              <div>
                <h2 className="text-xl font-extrabold text-[#1A3C2B]">Central Government Schemes</h2>
                <p className="text-sm text-gray-500">Available for all farmers across India</p>
              </div>
              <span className="ml-auto text-xs font-bold bg-[#2C6E49] text-white px-2.5 py-1 rounded-full">
                {filteredCentral.length} Schemes
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filteredCentral.map((scheme, i) => (
                <SchemeCard key={scheme.id} scheme={scheme} index={i} onClick={handleCardClick} />
              ))}
            </div>

            {filteredCentral.length === 0 && (
              <div className="text-center py-10 text-gray-400">
                <span className="text-3xl block mb-2">🔍</span>
                No central schemes match your search.
              </div>
            )}
          </div>
        </Section>

        {/* ═══ SECTION 5 — State Schemes ═══ */}
        <Section delay={0.35}>
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🏛️</span>
              <div>
                <h2 className="text-xl font-extrabold text-[#1A3C2B]">{selectedState} Government Schemes</h2>
                <p className="text-sm text-gray-500">Special benefits for {selectedState} farmers</p>
              </div>
              <span className="ml-auto text-xs font-bold bg-purple-600 text-white px-2.5 py-1 rounded-full">
                {filteredState.length} Schemes
              </span>
            </div>

            {filteredState.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredState.map((scheme, i) => (
                  <SchemeCard key={scheme.id} scheme={scheme} index={i} onClick={handleCardClick} />
                ))}
              </div>
            ) : currentStateSchemes.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
                <span className="text-4xl block mb-3">🚧</span>
                <p className="font-bold text-gray-700 mb-1">We're adding {selectedState} schemes soon!</p>
                <p className="text-sm text-gray-500">
                  Check out the central government schemes available for you above 👆
                </p>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-400">
                <span className="text-3xl block mb-2">🔍</span>
                No state schemes match your search.
              </div>
            )}
          </div>
        </Section>

        {/* ═══ SECTION 8 — Deadlines ═══ */}
        <Section delay={0.45}>
          <DeadlineTracker />
        </Section>

        {/* ═══ SECTION 9 — Helplines ═══ */}
        <Section delay={0.55}>
          <HelplineGrid selectedState={selectedState} />
        </Section>

      </div>

      {/* ─── Scheme Detail Modal ─── */}
      {selectedScheme && (
        <SchemeDetailModal
          scheme={selectedScheme}
          onClose={handleCloseModal}
          savedSchemes={savedSchemes}
          onToggleSave={toggleSave}
        />
      )}
    </div>
  );
};

export default GovtSchemes;
