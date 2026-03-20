import React from 'react';
import { Search, X } from 'lucide-react';

const SchemeSearchBar = ({ query, onChange }) => (
  <div className="relative max-w-lg w-full mb-5">
    <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
    <input
      type="text"
      placeholder="Search schemes, benefits, crops..."
      value={query}
      onChange={e => onChange(e.target.value)}
      className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:ring-2 focus:ring-[#78C850]/50 focus:border-[#78C850] outline-none transition-all shadow-sm"
      aria-label="Search schemes"
    />
    {query && (
      <button
        onClick={() => onChange('')}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label="Clear search"
      >
        <X size={16} />
      </button>
    )}
  </div>
);

export default SchemeSearchBar;
