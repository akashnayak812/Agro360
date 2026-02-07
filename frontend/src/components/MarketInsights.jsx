import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    TrendingUp,
    TrendingDown,
    DollarSign,
    BarChart3,
    PieChart,
    ArrowUpRight,
    ArrowDownRight,
    RefreshCw,
    Search,
    Filter,
    Volume2,
    Star,
    Clock,
    MapPin,
    Info,
    Sparkles
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const MarketInsights = () => {
    const { t } = useTranslation();
    const [selectedCrop, setSelectedCrop] = useState('wheat');
    const [selectedMarket, setSelectedMarket] = useState('all');
    const [timeRange, setTimeRange] = useState('week');
    const [loading, setLoading] = useState(false);
    const [priceData, setPriceData] = useState(null);
    const [cropPrices, setCropPrices] = useState([]);
    const [demandTrends, setDemandTrends] = useState([]);

    // Sample market data - In production, this would come from API
    const markets = [
        { id: 'all', name: 'All Markets' },
        { id: 'delhi', name: 'Delhi (Azadpur)' },
        { id: 'mumbai', name: 'Mumbai (Vashi)' },
        { id: 'hyderabad', name: 'Hyderabad (Bowenpally)' },
        { id: 'chennai', name: 'Chennai (Koyambedu)' },
        { id: 'bangalore', name: 'Bangalore (Yeshwantpur)' }
    ];

    const cropCategories = [
        { id: 'grains', name: 'Grains', crops: ['wheat', 'rice', 'maize', 'bajra'] },
        { id: 'pulses', name: 'Pulses', crops: ['chana', 'moong', 'urad', 'masoor'] },
        { id: 'vegetables', name: 'Vegetables', crops: ['tomato', 'onion', 'potato', 'cabbage'] },
        { id: 'oilseeds', name: 'Oilseeds', crops: ['soybean', 'groundnut', 'mustard', 'sunflower'] },
        { id: 'cash', name: 'Cash Crops', crops: ['cotton', 'sugarcane', 'jute', 'tobacco'] }
    ];

    // Simulated real-time price data
    const generatePriceData = () => {
        const basePrices = {
            wheat: 2200, rice: 2100, maize: 1850, bajra: 2000,
            chana: 5200, moong: 7500, urad: 6800, masoor: 5800,
            tomato: 2800, onion: 1500, potato: 1200, cabbage: 800,
            soybean: 4500, groundnut: 5500, mustard: 5200, sunflower: 5800,
            cotton: 6500, sugarcane: 350, jute: 4500, tobacco: 5000
        };

        const variation = (Math.random() - 0.5) * 200;
        const basePrice = basePrices[selectedCrop] || 2000;
        const currentPrice = basePrice + variation;
        const previousPrice = basePrice - (Math.random() - 0.3) * 150;
        const change = currentPrice - previousPrice;
        const changePercent = ((change / previousPrice) * 100).toFixed(2);

        return {
            crop: selectedCrop,
            currentPrice: currentPrice.toFixed(0),
            previousPrice: previousPrice.toFixed(0),
            change: change.toFixed(0),
            changePercent: changePercent,
            isPositive: change >= 0,
            high24h: (currentPrice * 1.02).toFixed(0),
            low24h: (currentPrice * 0.97).toFixed(0),
            volume: (Math.random() * 10000 + 5000).toFixed(0),
            msp: (basePrice * 0.9).toFixed(0),
            unit: 'per quintal'
        };
    };

    // Generate price history for chart
    const generatePriceHistory = () => {
        const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
        const history = [];
        let price = parseFloat(priceData?.currentPrice || 2000);

        for (let i = days; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            price += (Math.random() - 0.5) * 50;
            history.push({
                date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
                price: Math.max(price, 500).toFixed(0)
            });
        }
        return history;
    };

    // Generate all crop prices
    const generateAllCropPrices = () => {
        const crops = ['wheat', 'rice', 'tomato', 'onion', 'potato', 'cotton', 'soybean', 'maize'];
        return crops.map(crop => {
            const basePrices = {
                wheat: 2200, rice: 2100, tomato: 2800, onion: 1500,
                potato: 1200, cotton: 6500, soybean: 4500, maize: 1850
            };
            const base = basePrices[crop];
            const change = (Math.random() - 0.5) * 10;
            return {
                name: crop.charAt(0).toUpperCase() + crop.slice(1),
                price: base + (Math.random() - 0.5) * 200,
                change: change.toFixed(2),
                isPositive: change >= 0,
                demand: ['High', 'Medium', 'Low'][Math.floor(Math.random() * 3)],
                roi: (Math.random() * 30 + 10).toFixed(1)
            };
        });
    };

    // Generate demand trends
    const generateDemandTrends = () => {
        return [
            { crop: 'Tomato', trend: 'Rising', reason: 'Festival season approaching', confidence: 85 },
            { crop: 'Onion', trend: 'Stable', reason: 'Good supply from Maharashtra', confidence: 78 },
            { crop: 'Wheat', trend: 'Rising', reason: 'Export demand increasing', confidence: 82 },
            { crop: 'Cotton', trend: 'Falling', reason: 'International prices dropping', confidence: 70 },
            { crop: 'Soybean', trend: 'Rising', reason: 'Biodiesel demand surge', confidence: 75 }
        ];
    };

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setPriceData(generatePriceData());
            setCropPrices(generateAllCropPrices());
            setDemandTrends(generateDemandTrends());
            setLoading(false);
        }, 500);
    }, [selectedCrop, selectedMarket, timeRange]);

    const fetchLatestPrices = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/market/prices', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ crop: selectedCrop, market: selectedMarket })
            });
            const data = await response.json();
            if (data.success) {
                setPriceData(data.priceData);
            }
        } catch (error) {
            console.error('Error fetching prices:', error);
            // Use generated data as fallback
            setPriceData(generatePriceData());
        }
        setLoading(false);
    };

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN';
            window.speechSynthesis.speak(utterance);
        }
    };

    const priceHistory = priceData ? generatePriceHistory() : [];
    const maxPrice = Math.max(...priceHistory.map(p => parseFloat(p.price)));
    const minPrice = Math.min(...priceHistory.map(p => parseFloat(p.price)));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl text-emerald-600">
                        <BarChart3 size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Market Insights</h1>
                        <p className="text-gray-500">Real-time prices, demand trends & profit analysis</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={fetchLatestPrices}
                        variant="outline"
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </Button>
                    <button
                        onClick={() => speakText(`Current market price for ${selectedCrop} is ${priceData?.currentPrice} rupees per quintal. The price has ${priceData?.isPositive ? 'increased' : 'decreased'} by ${Math.abs(priceData?.changePercent)} percent.`)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Read Aloud"
                    >
                        <Volume2 size={20} className="text-gray-500" />
                    </button>
                </div>
            </div>

            {/* Filters */}
            <Card glass className="p-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Search size={18} className="text-gray-400" />
                        <select
                            value={selectedCrop}
                            onChange={(e) => setSelectedCrop(e.target.value)}
                            className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                        >
                            {cropCategories.flatMap(cat => cat.crops).map(crop => (
                                <option key={crop} value={crop}>
                                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-gray-400" />
                        <select
                            value={selectedMarket}
                            onChange={(e) => setSelectedMarket(e.target.value)}
                            className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                        >
                            {markets.map(market => (
                                <option key={market.id} value={market.id}>{market.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <Clock size={18} className="text-gray-400" />
                        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                            {['week', 'month', 'quarter'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                                        timeRange === range
                                            ? 'bg-emerald-500 text-white'
                                            : 'bg-white text-gray-600 hover:bg-gray-50'
                                    }`}
                                >
                                    {range === 'week' ? '1W' : range === 'month' ? '1M' : '3M'}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </Card>

            {/* Main Price Display */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Current Price Card */}
                <Card glass className="p-6 lg:col-span-2">
                    {priceData ? (
                        <div className="space-y-6">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wider">
                                        {selectedCrop.charAt(0).toUpperCase() + selectedCrop.slice(1)} Price
                                    </h2>
                                    <div className="flex items-baseline gap-3 mt-2">
                                        <span className="text-5xl font-bold text-gray-900">
                                            ₹{priceData.currentPrice}
                                        </span>
                                        <span className="text-lg text-gray-500">{priceData.unit}</span>
                                    </div>
                                    <div className={`flex items-center gap-1 mt-2 ${
                                        priceData.isPositive ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                        {priceData.isPositive ? (
                                            <ArrowUpRight size={20} />
                                        ) : (
                                            <ArrowDownRight size={20} />
                                        )}
                                        <span className="font-semibold">
                                            ₹{Math.abs(priceData.change)} ({priceData.changePercent}%)
                                        </span>
                                        <span className="text-gray-500 text-sm ml-1">today</span>
                                    </div>
                                </div>

                                <div className="text-right space-y-2">
                                    <div className="text-sm">
                                        <span className="text-gray-500">24h High: </span>
                                        <span className="font-semibold text-green-600">₹{priceData.high24h}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">24h Low: </span>
                                        <span className="font-semibold text-red-600">₹{priceData.low24h}</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="text-gray-500">MSP: </span>
                                        <span className="font-semibold text-blue-600">₹{priceData.msp}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Simple Price Chart */}
                            <div className="h-48 relative">
                                <div className="absolute inset-0 flex items-end justify-between gap-1">
                                    {priceHistory.slice(-30).map((point, idx) => {
                                        const height = ((parseFloat(point.price) - minPrice) / (maxPrice - minPrice)) * 100;
                                        return (
                                            <motion.div
                                                key={idx}
                                                initial={{ height: 0 }}
                                                animate={{ height: `${Math.max(height, 5)}%` }}
                                                transition={{ delay: idx * 0.02 }}
                                                className={`flex-1 rounded-t ${
                                                    idx === priceHistory.length - 1
                                                        ? 'bg-emerald-500'
                                                        : priceData.isPositive
                                                            ? 'bg-emerald-200 hover:bg-emerald-300'
                                                            : 'bg-red-200 hover:bg-red-300'
                                                } transition-colors cursor-pointer`}
                                                title={`${point.date}: ₹${point.price}`}
                                            />
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex justify-between text-xs text-gray-400">
                                <span>{priceHistory[0]?.date}</span>
                                <span>{priceHistory[Math.floor(priceHistory.length / 2)]?.date}</span>
                                <span>{priceHistory[priceHistory.length - 1]?.date}</span>
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <RefreshCw className="animate-spin" size={32} />
                        </div>
                    )}
                </Card>

                {/* Quick Stats */}
                <div className="space-y-4">
                    <Card glass className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <BarChart3 size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Trading Volume</div>
                                <div className="text-xl font-bold text-gray-900">{priceData?.volume || '---'} qtl</div>
                            </div>
                        </div>
                    </Card>

                    <Card glass className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <TrendingUp size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Avg. ROI</div>
                                <div className="text-xl font-bold text-gray-900">
                                    {cropPrices.find(c => c.name.toLowerCase() === selectedCrop)?.roi || '18.5'}%
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card glass className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-100 rounded-lg">
                                <Star size={20} className="text-amber-600" />
                            </div>
                            <div>
                                <div className="text-sm text-gray-500">Demand Level</div>
                                <div className="text-xl font-bold text-gray-900">
                                    {cropPrices.find(c => c.name.toLowerCase() === selectedCrop)?.demand || 'High'}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* All Crops Price Table */}
            <Card glass className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <PieChart className="text-emerald-500" size={24} />
                    All Crop Prices
                </h2>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                                <th className="pb-3 font-medium">Crop</th>
                                <th className="pb-3 font-medium">Price (₹/qtl)</th>
                                <th className="pb-3 font-medium">Change</th>
                                <th className="pb-3 font-medium">Demand</th>
                                <th className="pb-3 font-medium">Est. ROI</th>
                                <th className="pb-3 font-medium">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {cropPrices.map((crop, idx) => (
                                <motion.tr
                                    key={crop.name}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-gray-50 transition-colors"
                                >
                                    <td className="py-4">
                                        <span className="font-semibold text-gray-900">{crop.name}</span>
                                    </td>
                                    <td className="py-4">
                                        <span className="font-bold text-gray-900">₹{crop.price.toFixed(0)}</span>
                                    </td>
                                    <td className="py-4">
                                        <span className={`flex items-center gap-1 font-medium ${
                                            crop.isPositive ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {crop.isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                                            {crop.change}%
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                            crop.demand === 'High' ? 'bg-green-100 text-green-700' :
                                            crop.demand === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                        }`}>
                                            {crop.demand}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        <span className="font-semibold text-purple-600">{crop.roi}%</span>
                                    </td>
                                    <td className="py-4">
                                        <button
                                            onClick={() => setSelectedCrop(crop.name.toLowerCase())}
                                            className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                                        >
                                            View Details →
                                        </button>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Demand Trends & Predictions */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Demand Trends */}
                <Card glass className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Sparkles className="text-yellow-500" size={24} />
                        Demand Trends
                    </h2>

                    <div className="space-y-4">
                        {demandTrends.map((trend, idx) => (
                            <motion.div
                                key={trend.crop}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-900">{trend.crop}</span>
                                    <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                        trend.trend === 'Rising' ? 'bg-green-100 text-green-700' :
                                        trend.trend === 'Falling' ? 'bg-red-100 text-red-700' :
                                        'bg-gray-100 text-gray-700'
                                    }`}>
                                        {trend.trend === 'Rising' ? <TrendingUp size={12} /> :
                                         trend.trend === 'Falling' ? <TrendingDown size={12} /> : null}
                                        {trend.trend}
                                    </span>
                                </div>
                                <p className="text-sm text-gray-600">{trend.reason}</p>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-emerald-500 rounded-full"
                                            style={{ width: `${trend.confidence}%` }}
                                        />
                                    </div>
                                    <span className="text-xs text-gray-500">{trend.confidence}% confidence</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>

                {/* Profit Calculator */}
                <Card glass className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <DollarSign className="text-green-500" size={24} />
                        Quick Profit Calculator
                    </h2>

                    <ProfitCalculator selectedCrop={selectedCrop} currentPrice={priceData?.currentPrice} />
                </Card>
            </div>
        </motion.div>
    );
};

// Profit Calculator Sub-component
const ProfitCalculator = ({ selectedCrop, currentPrice }) => {
    const [quantity, setQuantity] = useState(10);
    const [costPerQuintal, setCostPerQuintal] = useState(1500);

    const totalRevenue = quantity * (parseFloat(currentPrice) || 2000);
    const totalCost = quantity * costPerQuintal;
    const profit = totalRevenue - totalCost;
    const profitMargin = ((profit / totalRevenue) * 100).toFixed(1);

    return (
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity (quintals)
                </label>
                <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    min="1"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Production Cost (₹/quintal)
                </label>
                <input
                    type="number"
                    value={costPerQuintal}
                    onChange={(e) => setCostPerQuintal(parseFloat(e.target.value) || 0)}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    min="100"
                />
            </div>

            <div className="pt-4 border-t border-gray-200 space-y-3">
                <div className="flex justify-between">
                    <span className="text-gray-600">Selling Price</span>
                    <span className="font-semibold">₹{currentPrice || '---'}/qtl</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-semibold text-blue-600">₹{totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Total Cost</span>
                    <span className="font-semibold text-red-600">₹{totalCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-900 font-semibold">Net Profit</span>
                    <span className={`text-xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        ₹{profit.toLocaleString()}
                    </span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Profit Margin</span>
                    <span className={`font-semibold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {profitMargin}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default MarketInsights;
