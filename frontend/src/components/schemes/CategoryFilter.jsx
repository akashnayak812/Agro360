import React from 'react';
import { SCHEME_CATEGORIES } from '../../data/govtSchemes';

const CategoryFilter = ({ activeCategory, onCategoryChange, schemeCounts = {} }) => (
  <div className="flex flex-wrap gap-2 mb-5">
    {SCHEME_CATEGORIES.map(cat => {
      const count = schemeCounts[cat.id] || 0;
      const isActive = activeCategory === cat.id;

      return (
        <button
          key={cat.id}
          onClick={() => onCategoryChange(cat.id)}
          className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-bold transition-all border ${
            isActive
              ? 'text-white shadow-md'
              : 'bg-white text-gray-600 border-gray-200 hover:border-current'
          }`}
          style={isActive ? { background: cat.color, borderColor: cat.color } : { }}
          aria-label={`Filter by ${cat.label}`}
          aria-pressed={isActive}
        >
          <span>{cat.emoji}</span>
          <span>{cat.label}</span>
          {cat.id !== 'all' && count > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
              isActive ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {count}
            </span>
          )}
        </button>
      );
    })}
  </div>
);

export default CategoryFilter;
