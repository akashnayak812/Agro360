import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, ChevronDown, Sparkles, PartyPopper } from 'lucide-react';
import { INDIAN_STATES, matchEligibility } from '../../data/govtSchemes';

const FARMER_TYPES = [
  { value: 'landowner', label: '🏡 Landowner', desc: 'Own agricultural land' },
  { value: 'tenant', label: '📋 Tenant', desc: 'Lease/rent farmland' },
  { value: 'sharecropper', label: '🤝 Sharecropper', desc: 'Share crop produce' },
];

const INCOME_RANGES = [
  { value: 'below_1l', label: 'Below ₹1 Lakh' },
  { value: '1l_2l', label: '₹1 – 2 Lakh' },
  { value: '2l_5l', label: '₹2 – 5 Lakh' },
  { value: 'above_5l', label: 'Above ₹5 Lakh' },
];

/* Count-up hook */
function useCountUp(target, duration = 1200) {
  const [value, setValue] = React.useState(0);
  const started = React.useRef(false);
  React.useEffect(() => {
    if (started.current || !target) return;
    started.current = true;
    const start = performance.now();
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return value;
}

const EligibilityChecker = ({ onSchemeClick }) => {
  const [landAcres, setLandAcres] = useState(2);
  const [farmerType, setFarmerType] = useState('landowner');
  const [incomeRange, setIncomeRange] = useState('below_1l');
  const [state, setState] = useState('Telangana');
  const [hasChecked, setHasChecked] = useState(false);

  const results = useMemo(() => {
    if (!hasChecked) return [];
    return matchEligibility({ landAcres, farmerType, incomeRange, state });
  }, [hasChecked, landAcres, farmerType, incomeRange, state]);

  const totalBenefit = useMemo(() => {
    return results.reduce((sum, r) => sum + (r.scheme.benefitAmount || 0), 0);
  }, [results]);

  const animTotal = useCountUp(hasChecked ? totalBenefit : 0);

  const handleCheck = () => setHasChecked(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-6 mb-6"
    >
      <h2 className="text-xl font-extrabold text-[#1A3C2B] mb-1 flex items-center gap-2">
        <Target size={22} className="text-[#E8B84B]" /> 🎯 Check Which Schemes You Qualify For
      </h2>
      <p className="text-sm text-gray-500 mb-5">Fill in your details — takes 10 seconds</p>

      {/* Form */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {/* Land Acres */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Land Holding
          </label>
          <div className="relative">
            <input
              type="number"
              value={landAcres}
              onChange={e => { setLandAcres(Number(e.target.value) || 0); setHasChecked(false); }}
              min="0"
              max="500"
              step="0.5"
              className="w-full p-3 pr-14 bg-gray-50 border border-gray-200 rounded-xl text-lg font-bold text-gray-900 focus:ring-2 focus:ring-[#78C850]/50 outline-none"
              aria-label="Land holding in acres"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">acres</span>
          </div>
          <input
            type="range"
            value={landAcres}
            onChange={e => { setLandAcres(Number(e.target.value)); setHasChecked(false); }}
            min="0" max="50" step="0.5"
            className="w-full mt-2 accent-[#78C850] h-1.5"
            aria-label="Land holding slider"
          />
        </div>

        {/* Farmer Type */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            You are a
          </label>
          <div className="space-y-1.5">
            {FARMER_TYPES.map(t => (
              <button
                key={t.value}
                onClick={() => { setFarmerType(t.value); setHasChecked(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  farmerType === t.value
                    ? 'bg-[#2C6E49] text-white border-[#2C6E49] shadow'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#78C850]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Income */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Annual Income
          </label>
          <div className="space-y-1.5">
            {INCOME_RANGES.map(r => (
              <button
                key={r.value}
                onClick={() => { setIncomeRange(r.value); setHasChecked(false); }}
                className={`w-full text-left px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                  incomeRange === r.value
                    ? 'bg-[#2C6E49] text-white border-[#2C6E49] shadow'
                    : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-[#78C850]'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">
            Your State
          </label>
          <div className="relative">
            <select
              value={state}
              onChange={e => { setState(e.target.value); setHasChecked(false); }}
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-900 appearance-none outline-none focus:ring-2 focus:ring-[#78C850]/50 cursor-pointer"
              aria-label="Select your state"
            >
              {INDIAN_STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Check Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleCheck}
        className="w-full sm:w-auto px-8 py-3 bg-[#78C850] hover:bg-[#6ab842] text-white font-bold text-base rounded-xl shadow-lg shadow-green-200 transition-colors flex items-center gap-2 mx-auto"
      >
        <Sparkles size={18} /> Check My Eligibility
      </motion.button>

      {/* Results */}
      <AnimatePresence>
        {hasChecked && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 overflow-hidden"
          >
            {/* Total Benefit */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="bg-gradient-to-r from-[#2C6E49] to-[#4C9B6E] rounded-2xl p-5 mb-5 text-center text-white"
            >
              <p className="text-sm font-medium opacity-90 mb-1">
                <PartyPopper size={16} className="inline mr-1" /> You qualify for {results.length} schemes!
              </p>
              <p className="text-sm opacity-80">Total potential benefit:</p>
              <p className="text-4xl font-extrabold mt-1">
                ₹{animTotal.toLocaleString('en-IN')}<span className="text-lg font-medium opacity-80">/year</span>
              </p>
            </motion.div>

            {/* Matched Scheme Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((r, i) => (
                <motion.div
                  key={r.scheme.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  onClick={() => onSchemeClick?.(r.scheme)}
                  className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-3 cursor-pointer hover:bg-green-100 transition-colors"
                >
                  <span className="text-2xl shrink-0">{r.scheme.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-sm text-gray-900 truncate">{r.scheme.name}</p>
                    <p className="text-xs text-gray-500 truncate">{r.scheme.benefit}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-bold bg-[#78C850] text-white px-2 py-1 rounded-full">
                    ✅ Eligible
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasChecked && results.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6 text-center py-6">
          <span className="text-3xl mb-2 block">🤔</span>
          <p className="text-gray-500 font-medium">No perfect matches found. Try adjusting your details.</p>
          <p className="text-sm text-gray-400 mt-1">All central schemes are still available for you!</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EligibilityChecker;
