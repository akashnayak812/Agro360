import React from 'react';
import { useLocationData } from '../context/LocationContext';
import { MapPin, RefreshCw, Cloud, Thermometer, Droplets, Wind, AlertCircle } from 'lucide-react';

export default function LocationWidget({ className = '' }) {
  const { address, weather, isLocating, error, fetchLocationAndData } = useLocationData();

  return (
    <div className={`bg-white/80 backdrop-blur border border-purple-100/50 shadow-sm rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all ${className}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2.5 rounded-xl ${isLocating ? 'bg-purple-100 text-purple-500 animate-pulse' : 'bg-purple-50 text-purple-600'}`}>
          <MapPin size={22} className={isLocating ? 'animate-bounce' : ''} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
            Your Location
            {isLocating && <span className="text-xs text-purple-500 font-normal animate-pulse">Detecting...</span>}
          </h3>
          <p className="text-xs text-gray-500">
            {error ? (
              <span className="text-red-500 flex items-center gap-1"><AlertCircle size={12}/> {error}</span>
            ) : address ? (
              `${address.city}, ${address.district || address.state}`
            ) : isLocating ? (
              'Acquiring GPS data & weather...'
            ) : (
              'Location not set. Click refresh to auto-fill data.'
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        {weather && !isLocating && (
          <div className="flex items-center gap-4 px-4 py-2 bg-blue-50/50 rounded-xl border border-blue-100/50">
            <div className="flex items-center gap-1.5 min-w-max text-sm font-medium text-blue-900">
              <Thermometer size={16} className="text-blue-500" />
              {weather.temperature}°C
            </div>
            <div className="w-px h-4 bg-blue-200"></div>
            <div className="flex items-center gap-1.5 min-w-max text-sm font-medium text-cyan-900">
              <Droplets size={16} className="text-cyan-500" />
              {weather.humidity}%
            </div>
            <div className="w-px h-4 bg-blue-200"></div>
            <div className="flex items-center gap-1.5 min-w-max text-sm font-medium text-slate-700">
              <Cloud size={16} className="text-slate-500" />
              {weather.condition}
            </div>
          </div>
        )}

        <button
          onClick={fetchLocationAndData}
          disabled={isLocating}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 hover:border-purple-300 hover:bg-purple-50 text-sm font-medium text-gray-700 hover:text-purple-700 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed ml-auto sm:ml-0 shadow-sm"
        >
          <RefreshCw size={16} className={isLocating ? 'animate-spin' : ''} />
          {isLocating ? 'Fetching...' : address ? 'Refresh' : 'Use My Location'}
        </button>
      </div>
    </div>
  );
}
