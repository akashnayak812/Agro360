import React from 'react';
import { Card } from './ui/Card';
import { TrendingUp, TrendingDown, Clock, MapPin, Landmark } from 'lucide-react';

const MarketInsightsCard = ({ data }) => {
    if (!data) return null;

    const {
        crop,
        market,
        state,
        min_price,
        max_price,
        modal_price,
        trend,
        arrival_date,
        district
    } = data;

    const isIncreasing = trend === "increasing";

    return (
        <Card glass className="p-6 mb-6">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h2 className="text-3xl font-extrabold text-emerald-950 dark:text-white mb-3 drop-shadow-sm">
                        Pricing for {crop}
                    </h2>
                    <div className="flex items-center space-x-5 text-emerald-800 dark:text-emerald-200 font-medium">
                        <span className="flex items-center">
                            <Landmark className="w-4 h-4 mr-1" />
                            {market} Market
                        </span>
                        <span className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {district ? `${district}, ` : ''}{state}
                        </span>
                        <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Arrival: {arrival_date || "Today"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-4 bg-emerald-50/80 dark:bg-emerald-900/20 rounded-xl border border-emerald-100 dark:border-emerald-800 backdrop-blur-sm">
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium mb-1">Modal Price</p>
                    <div className="flex items-end space-x-2">
                        <span className="text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                            ₹{modal_price}
                        </span>
                        <span className="text-sm text-emerald-600 dark:text-emerald-400 mb-1">/ quintal</span>
                    </div>
                </div>

                <div className="p-4 bg-white/80 dark:bg-gray-800/60 rounded-xl border border-emerald-100 dark:border-gray-700 backdrop-blur-md shadow-sm">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mb-1">Minimum Price</p>
                    <div className="flex items-end space-x-2">
                        <span className="text-2xl font-bold text-emerald-950 dark:text-white">
                            ₹{min_price}
                        </span>
                    </div>
                </div>

                <div className="p-4 bg-white/80 dark:bg-gray-800/60 rounded-xl border border-emerald-100 dark:border-gray-700 backdrop-blur-md shadow-sm">
                    <p className="text-sm text-gray-700 dark:text-gray-300 font-semibold mb-1">Maximum Price</p>
                    <div className="flex items-end space-x-2">
                        <span className="text-2xl font-bold text-emerald-950 dark:text-white">
                            ₹{max_price}
                        </span>
                    </div>
                </div>

                <div className={`p-4 rounded-xl border flex flex-col justify-center items-center backdrop-blur-sm ${isIncreasing
                    ? 'bg-red-50/80 dark:bg-red-900/20 border-red-100 dark:border-red-800'
                    : trend === 'decreasing'
                        ? 'bg-emerald-50/80 dark:bg-emerald-900/20 border-emerald-100 dark:border-emerald-800'
                        : 'bg-blue-50/80 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800'
                    }`}>
                    <p className={`text-sm font-medium mb-2 ${isIncreasing ? 'text-red-600 dark:text-red-400'
                        : trend === 'decreasing' ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}>Price Trend</p>
                    <div className={`flex items-center text-lg font-bold ${isIncreasing ? 'text-red-700 dark:text-red-300'
                        : trend === 'decreasing' ? 'text-emerald-700 dark:text-emerald-300'
                            : 'text-blue-700 dark:text-blue-300'
                        }`}>
                        {isIncreasing ? <TrendingUp className="w-5 h-5 mr-2" />
                            : trend === 'decreasing' ? <TrendingDown className="w-5 h-5 mr-2" />
                                : null}
                        {isIncreasing ? 'Increasing Pricing'
                            : trend === 'decreasing' ? 'Decreasing Pricing'
                                : 'Stable Pricing'}
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default MarketInsightsCard;
