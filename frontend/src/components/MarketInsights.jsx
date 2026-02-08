import React, { useState, useEffect, useMemo } from 'react';
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
    Sparkles,
    Landmark
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

// Animated Line Chart Component
const PriceHistoryChart = ({ data, color = "#10B981" }) => {
    const maxPrice = Math.max(...data.map(d => parseFloat(d.price)));
    const minPrice = Math.min(...data.map(d => parseFloat(d.price)));
    const range = maxPrice - minPrice;

    // Normalize points for SVG path
    const points = data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - ((parseFloat(d.price) - minPrice) / range) * 80 - 10; // Keep some padding
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="h-48 w-full relative">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
                {/* Gradient Definition */}
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>

                {/* Area under the line */}
                <motion.path
                    d={`M0,100 ${points.split(' ').map((p, i) => `L${p}`).join(' ')} L100,100 Z`}
                    fill="url(#chartGradient)"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                />

                {/* The Line */}
                <motion.polyline
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                />

                {/* Dots on points */}
                {data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 100;
                    const y = 100 - ((parseFloat(d.price) - minPrice) / range) * 80 - 10;
                    return (
                        <motion.circle
                            key={i}
                            cx={x}
                            cy={y}
                            r="1.5"
                            fill="white"
                            stroke={color}
                            strokeWidth="1"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 1 + i * 0.05 }}
                        />
                    );
                })}
            </svg>

            {/* Tooltip Overlay (simplified) */}
            <div className="absolute inset-0 flex justify-between items-end pb-2 opacity-0 hover:opacity-100 transition-opacity">
                {data.filter((_, i) => i % Math.ceil(data.length / 5) === 0).map((d, i) => (
                    <div key={i} className="text-[10px] text-gray-400 font-medium bg-white/80 px-1 rounded transform translate-y-4">
                        {d.date}
                    </div>
                ))}
            </div>
        </div>
    );
};

// Market Comparison Bar Chart
const MarketComparisonChart = ({ markets, currentPrice }) => {
    // Generate mock price variations for comparison
    const comparisonData = useMemo(() => {
        return markets.map(m => ({
            name: m.name.split(' ')[0], // City name
            price: m.id === 'all' ? currentPrice : currentPrice * (0.9 + Math.random() * 0.2),
            distance: Math.floor(Math.random() * 500) + 50
        })).sort((a, b) => b.price - a.price);
    }, [markets, currentPrice]);

    const maxVal = Math.max(...comparisonData.map(d => d.price));

    return (
        <div className="space-y-3 mt-4">
            {comparisonData.map((item, idx) => (
                <div key={item.name} className="relative">
                    <div className="flex justify-between text-xs mb-1">
                        <span className="font-medium text-gray-700">{item.name}</span>
                        <span className="font-bold text-gray-900">₹{item.price.toFixed(0)}</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.price / maxVal) * 100}%` }}
                            transition={{ duration: 1, delay: idx * 0.1 }}
                            className={`h-full rounded-full ${item.price === maxVal ? 'bg-green-500' :
                                    item.price > currentPrice ? 'bg-emerald-400' : 'bg-blue-400'
                                }`}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};


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
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Agri-Market Insights</h1>
                        <p className="text-gray-500">Real-time Mandi Prices & Trends</p>
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
                        Refresh Data
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
                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        <Search size={18} className="text-gray-400 ml-2" />
                        <select
                            value={selectedCrop}
                            onChange={(e) => setSelectedCrop(e.target.value)}
                            className="bg-transparent p-1.5 text-sm font-medium outline-none text-gray-700 w-32"
                        >
                            {cropCategories.flatMap(cat => cat.crops).map(crop => (
                                <option key={crop} value={crop}>
                                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        <MapPin size={18} className="text-gray-400 ml-2" />
                        <select
                            value={selectedMarket}
                            onChange={(e) => setSelectedMarket(e.target.value)}
                            className="bg-transparent p-1.5 text-sm font-medium outline-none text-gray-700 w-40"
                        >
                            {markets.map(market => (
                                <option key={market.id} value={market.id}>{market.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2 ml-auto">
                        <Clock size={16} className="text-gray-400" />
                        <div className="flex rounded-lg border border-gray-200 overflow-hidden">
                            {['week', 'month', 'quarter'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setTimeRange(range)}
                                    className={`px-3 py-1.5 text-xs font-medium transition-colors ${timeRange === range
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
                {/* Current Price Card & Chart */}
                <Card glass className="p-6 lg:col-span-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

                    {priceData ? (
                        <div className="space-y-6 relative z-10">
                            <div className="flex items-start justify-between">
                                <div>
                                    <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest flex items-center gap-2">
                                        <Landmark size={14} />
                                        Mandi Price Live
                                    </h2>
                                    <div className="flex items-baseline gap-3 mt-1">
                                        <span className="text-5xl font-bold text-gray-900 tracking-tight">
                                            ₹{priceData.currentPrice}
                                        </span>
                                        <span className="text-lg text-gray-500 font-medium">{priceData.unit}</span>
                                    </div>
                                    <div className={`flex items-center gap-2 mt-2 px-3 py-1 rounded-full w-fit ${priceData.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                        }`}>
                                        {priceData.isPositive ? (
                                            <ArrowUpRight size={18} />
                                        ) : (
                                            <ArrowDownRight size={18} />
                                        )}
                                        <span className="font-bold">
                                            ₹{Math.abs(priceData.change)} ({priceData.changePercent}%)
                                        </span>
                                    </div>
                                </div>

                                <div className="text-right space-y-2">
                                    <div className="text-sm p-2 bg-gray-50 rounded-lg">
                                        <span className="text-gray-500 block text-xs">High (24h)</span>
                                        <span className="font-bold text-green-600">₹{priceData.high24h}</span>
                                    </div>
                                    <div className="text-sm p-2 bg-gray-50 rounded-lg">
                                        <span className="text-gray-500 block text-xs">Low (24h)</span>
                                        <span className="font-bold text-red-600">₹{priceData.low24h}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Animated Line Chart */}
                            <div className="pt-4 border-t border-gray-100">
                                <h3 className="text-xs font-semibold text-gray-400 mb-4">PRICE TREND ({timeRange.toUpperCase()})</h3>
                                <PriceHistoryChart data={priceHistory} color={priceData.isPositive ? '#10B981' : '#EF4444'} />
                            </div>
                        </div>
                    ) : (
                        <div className="h-64 flex items-center justify-center text-gray-400">
                            <RefreshCw className="animate-spin" size={32} />
                        </div>
                    )}
                </Card>

                {/* Market Comparison & Stats */}
                <div className="space-y-6">
                    <Card glass className="p-5 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <MapPin size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">Market Comparison</h3>
                                <p className="text-xs text-gray-500">Prices in nearby mandis</p>
                            </div>
                        </div>
                        {priceData && <MarketComparisonChart markets={markets.filter(m => m.id !== 'all')} currentPrice={parseFloat(priceData.currentPrice)} />}
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <Card glass className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
                            <div className="mb-2 p-2 bg-amber-100 rounded-lg w-fit">
                                <Star size={18} className="text-amber-600" />
                            </div>
                            <div className="text-xs text-gray-500">Demand</div>
                            <div className="text-lg font-bold text-gray-900">
                                {cropPrices.find(c => c.name.toLowerCase() === selectedCrop)?.demand || 'High'}
                            </div>
                        </Card>
                        <Card glass className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
                            <div className="mb-2 p-2 bg-purple-100 rounded-lg w-fit">
                                <TrendingUp size={18} className="text-purple-600" />
                            </div>
                            <div className="text-xs text-gray-500">Avg. ROI</div>
                            <div className="text-lg font-bold text-gray-900">
                                {cropPrices.find(c => c.name.toLowerCase() === selectedCrop)?.roi || '18.5'}%
                            </div>
                        </Card>
                    </div>
                </div>
            </div>

            {/* Bottom Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Demand Trends */}
                <Card glass className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <Sparkles className="text-yellow-500" size={24} />
                        Market Predictions
                    </h2>

                    <div className="space-y-4">
                        {demandTrends.map((trend, idx) => (
                            <motion.div
                                key={trend.crop}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-4 bg-white border border-gray-100 rounded-xl hover:shadow-md transition-all flex items-center justify-between group"
                            >
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-gray-900">{trend.crop}</span>
                                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${trend.trend === 'Rising' ? 'bg-green-100 text-green-700' :
                                                trend.trend === 'Falling' ? 'bg-red-100 text-red-700' :
                                                    'bg-gray-100 text-gray-700'
                                            }`}>
                                            {trend.trend === 'Rising' ? <TrendingUp size={10} /> :
                                                trend.trend === 'Falling' ? <TrendingDown size={10} /> : null}
                                            {trend.trend}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">{trend.reason}</p>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-400 mb-1">Confidence</div>
                                    <div className="radial-progress text-emerald-500 font-bold text-xs" style={{ "--value": trend.confidence, "--size": "2rem" }}>
                                        {trend.confidence}%
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>

                {/* Profit Calculator */}
                <Card glass className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
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
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Quantity (qtl)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(parseFloat(e.target.value) || 0)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-gray-900"
                            min="1"
                        />
                        <span className="absolute right-3 top-3.5 text-xs text-gray-400">quintals</span>
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                        Production Cost
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            value={costPerQuintal}
                            onChange={(e) => setCostPerQuintal(parseFloat(e.target.value) || 0)}
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-semibold text-gray-900"
                            min="100"
                        />
                        <span className="absolute right-3 top-3.5 text-xs text-gray-400">₹/qtl</span>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-emerald-50/30 rounded-xl p-4 border border-gray-100 space-y-3">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Est. Revenue</span>
                    <span className="font-semibold text-gray-900">₹{totalRevenue.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600 text-sm">Total Cost</span>
                    <span className="font-semibold text-red-500">- ₹{totalCost.toLocaleString()}</span>
                </div>
                <div className="h-px bg-gray-200 my-2" />
                <div className="flex justify-between items-end">
                    <span className="text-gray-900 font-bold">Net Profit</span>
                    <div className="text-right">
                        <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ₹{profit.toLocaleString()}
                        </div>
                        <div className={`text-xs font-medium ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {profitMargin}% Margin
                        </div>
                    </div>
                </div>
            </div>

            <Button className="w-full bg-gray-900 hover:bg-black text-white py-3 rounded-xl shadow-lg shadow-gray-200">
                Save Calculation
            </Button>
        </div>
    );
};

export default MarketInsights;
