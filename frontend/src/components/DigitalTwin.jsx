import { API_URL } from '../lib/api';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Activity,
    CloudRain,
    Droplets,
    Thermometer,
    Wind,
    Sun,
    TrendingUp,
    TrendingDown,
    AlertTriangle,
    CheckCircle,
    RefreshCw,
    Sprout,
    DollarSign,
    Gauge,
    Zap,
    Calendar,
    Play,
    Pause,
    SkipForward,
    Volume2
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { fetchWeatherByIP } from '../services/weatherApi';
import { useAuth } from '../context/AuthContext';

const DigitalTwin = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [isSimulating, setIsSimulating] = useState(false);
    const [simulationSpeed, setSimulationSpeed] = useState(1);
    const [currentDay, setCurrentDay] = useState(1);
    const [simulationResults, setSimulationResults] = useState(null);
    const [loading, setLoading] = useState(false);
    const intervalRef = useRef(null);

    const [farmConfig, setFarmConfig] = useState({
        cropType: 'wheat',
        fieldArea: 5,
        soilType: 'loamy',
        irrigationType: 'drip',
        fertilizerBudget: 5000,
        seasonDuration: 120
    });

    const [farmParams, setFarmParams] = useState({
        area: 5,
        cropType: 'rice',
        soilType: 'clay',
        irrigationMethod: 'sprinkler'
    });

    // Auto-fill from Farm Profile
    useEffect(() => {
        if (user) {
            const profile = localStorage.getItem(`agro360_farm_profile_${user.uid}`);
            if (profile) {
                try {
                    const parsed = JSON.parse(profile);
                    setFarmParams(prev => ({
                        ...prev,
                        area: parsed.fieldArea ? parseFloat(parsed.fieldArea) : prev.area,
                        cropType: parsed.defaultCrop || prev.cropType,
                        soilType: parsed.soilType || prev.soilType
                    }));
                } catch (e) {
                    console.error("Failed to parse farm profile", e);
                }
            }
        }
    }, [user]);

    const [weatherConditions, setWeatherConditions] = useState({
        temperature: 28,
        humidity: 65,
        rainfall: 2.5,
        windSpeed: 12,
        sunlight: 8
    });

    const [currentSimulation, setCurrentSimulation] = useState({
        cropHealth: 85,
        waterLevel: 70,
        nutrientLevel: 75,
        pestRisk: 15,
        estimatedYield: 0,
        estimatedProfit: 0,
        totalCost: 0,
        alerts: []
    });

    const cropOptions = [
        { value: 'wheat', label: 'Wheat (गेहूं)' },
        { value: 'rice', label: 'Rice (चावल)' },
        { value: 'cotton', label: 'Cotton (कपास)' },
        { value: 'sugarcane', label: 'Sugarcane (गन्ना)' },
        { value: 'maize', label: 'Maize (मक्का)' },
        { value: 'soybean', label: 'Soybean (सोयाबीन)' },
        { value: 'groundnut', label: 'Groundnut (मूंगफली)' },
        { value: 'tomato', label: 'Tomato (टमाटर)' }
    ];

    const soilTypes = [
        { value: 'loamy', label: 'Loamy (दोमट)' },
        { value: 'clay', label: 'Clay (चिकनी मिट्टी)' },
        { value: 'sandy', label: 'Sandy (बालू)' },
        { value: 'black', label: 'Black (काली मिट्टी)' },
        { value: 'red', label: 'Red (लाल मिट्टी)' }
    ];

    const irrigationTypes = [
        { value: 'drip', label: 'Drip Irrigation (ड्रिप)' },
        { value: 'sprinkler', label: 'Sprinkler (स्प्रिंकलर)' },
        { value: 'flood', label: 'Flood (बाढ़ सिंचाई)' },
        { value: 'rainfed', label: 'Rainfed (वर्षा आधारित)' }
    ];

    const handleSyncLiveWeather = async () => {
        try {
            setLoading(true);
            const data = await fetchWeatherByIP();
            setWeatherConditions(prev => ({
                ...prev,
                temperature: data.temperature ?? prev.temperature,
                humidity: data.humidity ?? prev.humidity,
                rainfall: data.rainfall ?? prev.rainfall,
                windSpeed: data.windSpeed ?? prev.windSpeed,
            }));
        } catch (error) {
            console.error("Failed to sync live weather:", error);
            alert("Could not fetch live weather. Please ensure Location permissions are granted.");
        } finally {
            setLoading(false);
        }
    };

    // Simulation logic
    const runSimulationStep = () => {
        setCurrentDay(prev => {
            const newDay = prev + 1;
            if (newDay > farmConfig.seasonDuration) {
                stopSimulation();
                return prev;
            }

            // Dynamic simulation based on weather and farm conditions
            const weatherImpact = calculateWeatherImpact();
            const newAlerts = [];

            // Update crop health
            let healthChange = 0;
            if (weatherConditions.temperature > 38) {
                healthChange -= 2;
                newAlerts.push({ type: 'warning', message: 'High temperature stress detected!' });
            } else if (weatherConditions.temperature < 15) {
                healthChange -= 1;
                newAlerts.push({ type: 'info', message: 'Cold weather may slow growth' });
            } else {
                healthChange += 0.5;
            }

            // Water level impact
            let waterChange = -1.5;
            if (weatherConditions.rainfall > 5) {
                waterChange += weatherConditions.rainfall * 0.8;
            }
            if (farmConfig.irrigationType === 'drip') {
                waterChange += 0.5;
            }

            // Nutrient depletion
            let nutrientChange = -0.3;
            if (newDay % 15 === 0 && farmConfig.fertilizerBudget > 500) {
                nutrientChange += 10;
            }

            // Pest risk
            let pestChange = 0;
            if (weatherConditions.humidity > 80) {
                pestChange += 2;
                newAlerts.push({ type: 'danger', message: 'High humidity increases pest risk!' });
            }
            if (weatherConditions.temperature > 25 && weatherConditions.temperature < 32) {
                pestChange += 0.5;
            }

            setCurrentSimulation(prev => {
                const newHealth = Math.min(100, Math.max(0, prev.cropHealth + healthChange));
                const newWater = Math.min(100, Math.max(0, prev.waterLevel + waterChange));
                const newNutrient = Math.min(100, Math.max(0, prev.nutrientLevel + nutrientChange));
                const newPest = Math.min(100, Math.max(0, prev.pestRisk + pestChange));

                // Calculate yield and profit based on current conditions
                const yieldFactor = (newHealth / 100) * (newNutrient / 100) * (1 - newPest / 200);
                const baseYield = getBaseYield(farmConfig.cropType) * farmConfig.fieldArea;
                const estimatedYield = (baseYield * yieldFactor * (newDay / farmConfig.seasonDuration)).toFixed(2);

                const marketPrice = getMarketPrice(farmConfig.cropType);
                const estimatedProfit = (estimatedYield * marketPrice - farmConfig.fertilizerBudget * 0.5).toFixed(0);

                return {
                    cropHealth: newHealth,
                    waterLevel: newWater,
                    nutrientLevel: newNutrient,
                    pestRisk: newPest,
                    estimatedYield: estimatedYield,
                    estimatedProfit: estimatedProfit,
                    totalCost: farmConfig.fertilizerBudget * 0.5 + farmConfig.fieldArea * 2000,
                    alerts: [...prev.alerts.slice(-4), ...newAlerts].slice(-5)
                };
            });

            return newDay;
        });
    };

    const getBaseYield = (crop) => {
        const yields = {
            wheat: 4.5, rice: 5.0, cotton: 2.5, sugarcane: 70,
            maize: 6.0, soybean: 2.0, groundnut: 1.8, tomato: 25
        };
        return yields[crop] || 3;
    };

    const getMarketPrice = (crop) => {
        const prices = {
            wheat: 2200, rice: 2000, cotton: 6500, sugarcane: 350,
            maize: 1850, soybean: 4500, groundnut: 5500, tomato: 2500
        };
        return prices[crop] || 2000;
    };

    const calculateWeatherImpact = () => {
        let impact = 1;
        if (weatherConditions.temperature > 35 || weatherConditions.temperature < 10) impact *= 0.7;
        if (weatherConditions.rainfall < 1) impact *= 0.8;
        if (weatherConditions.humidity > 85 || weatherConditions.humidity < 40) impact *= 0.9;
        return impact;
    };

    const startSimulation = () => {
        setIsSimulating(true);
        intervalRef.current = setInterval(runSimulationStep, 1000 / simulationSpeed);
    };

    const stopSimulation = () => {
        setIsSimulating(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const resetSimulation = () => {
        stopSimulation();
        setCurrentDay(1);
        setCurrentSimulation({
            cropHealth: 85,
            waterLevel: 70,
            nutrientLevel: 75,
            pestRisk: 15,
            estimatedYield: 0,
            estimatedProfit: 0,
            totalCost: 0,
            alerts: []
        });
    };

    const runFullSimulation = async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/simulator/run`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    farmConfig,
                    weatherConditions
                })
            });
            const data = await response.json();
            if (data.success) {
                setSimulationResults(data.results);
            }
        } catch (error) {
            console.error('Simulation error:', error);
            // Run local simulation
            simulateLocally();
        }
        setLoading(false);
    };

    const simulateLocally = () => {
        const days = farmConfig.seasonDuration;
        const baseYield = getBaseYield(farmConfig.cropType) * farmConfig.fieldArea;
        const weatherFactor = calculateWeatherImpact();
        
        const finalYield = (baseYield * weatherFactor * 0.85).toFixed(2);
        const marketPrice = getMarketPrice(farmConfig.cropType);
        const revenue = finalYield * marketPrice;
        const costs = farmConfig.fertilizerBudget + farmConfig.fieldArea * 3000;
        const profit = revenue - costs;

        setSimulationResults({
            predictedYield: finalYield,
            unit: 'tonnes',
            estimatedRevenue: revenue.toFixed(0),
            estimatedCost: costs.toFixed(0),
            estimatedProfit: profit.toFixed(0),
            profitMargin: ((profit / revenue) * 100).toFixed(1),
            riskLevel: profit > 0 ? 'Low' : 'High',
            recommendations: [
                'Consider drip irrigation to save water by 40%',
                'Apply organic fertilizer for better soil health',
                'Monitor pest activity during high humidity periods',
                'Optimal harvest window: Days 110-120'
            ],
            weatherRisks: [
                { risk: 'Heat Wave', probability: 25, impact: 'Moderate' },
                { risk: 'Heavy Rainfall', probability: 40, impact: 'High' },
                { risk: 'Pest Outbreak', probability: 15, impact: 'Severe' }
            ]
        });
    };

    useEffect(() => {
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    useEffect(() => {
        if (isSimulating) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            intervalRef.current = setInterval(runSimulationStep, 1000 / simulationSpeed);
        }
    }, [simulationSpeed]);

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN';
            window.speechSynthesis.speak(utterance);
        }
    };

    const ProgressBar = ({ value, color, label }) => (
        <div className="space-y-1">
            <div className="flex justify-between text-sm">
                <span className="text-gray-600">{label}</span>
                <span className="font-semibold">{value.toFixed(0)}%</span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                    className={`h-full ${color} rounded-full`}
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.5 }}
                />
            </div>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-cyan-100 to-blue-100 rounded-2xl text-cyan-600">
                        <Activity size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Digital Twin Simulator</h1>
                        <p className="text-gray-500">Simulate your farm conditions and predict outcomes</p>
                    </div>
                </div>
                <button
                    onClick={() => speakText('Welcome to Digital Twin Simulator. Configure your farm parameters to simulate crop growth, predict yield, and assess risks.')}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Read Aloud"
                >
                    <Volume2 size={20} className="text-gray-500" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Farm Configuration */}
                <Card glass className="p-6 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Sprout className="text-green-500" size={24} />
                        Farm Configuration
                    </h2>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Crop Type</label>
                            <select
                                value={farmConfig.cropType}
                                onChange={(e) => setFarmConfig({ ...farmConfig, cropType: e.target.value })}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            >
                                {cropOptions.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Field Area (Hectares)</label>
                            <input
                                type="number"
                                value={farmConfig.fieldArea}
                                onChange={(e) => setFarmConfig({ ...farmConfig, fieldArea: parseFloat(e.target.value) })}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                min="0.5"
                                step="0.5"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Soil Type</label>
                            <select
                                value={farmConfig.soilType}
                                onChange={(e) => setFarmConfig({ ...farmConfig, soilType: e.target.value })}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            >
                                {soilTypes.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Irrigation Type</label>
                            <select
                                value={farmConfig.irrigationType}
                                onChange={(e) => setFarmConfig({ ...farmConfig, irrigationType: e.target.value })}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                            >
                                {irrigationTypes.map(opt => (
                                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Fertilizer Budget (₹)</label>
                            <input
                                type="number"
                                value={farmConfig.fertilizerBudget}
                                onChange={(e) => setFarmConfig({ ...farmConfig, fertilizerBudget: parseFloat(e.target.value) })}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                min="1000"
                                step="500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Season Duration (Days)</label>
                            <input
                                type="number"
                                value={farmConfig.seasonDuration}
                                onChange={(e) => setFarmConfig({ ...farmConfig, seasonDuration: parseInt(e.target.value) })}
                                className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                                min="60"
                                max="365"
                            />
                        </div>
                    </div>
                </Card>

                {/* Weather Conditions */}
                <Card glass className="p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                            <CloudRain className="text-blue-500" size={24} />
                            Weather Conditions
                        </h2>
                        <Button
                            onClick={handleSyncLiveWeather}
                            disabled={loading || isSimulating}
                            variant="outline"
                            className="flex items-center gap-2 text-sm bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700 h-9"
                        >
                            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                            Sync Live
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <Thermometer size={16} className="text-orange-500" />
                                Temperature (°C)
                            </label>
                            <input
                                type="range"
                                min="5"
                                max="45"
                                value={weatherConditions.temperature}
                                onChange={(e) => setWeatherConditions({ ...weatherConditions, temperature: parseInt(e.target.value) })}
                                className="w-full"
                            />
                            <div className="text-right text-sm font-semibold text-orange-600">{weatherConditions.temperature}°C</div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <Droplets size={16} className="text-blue-500" />
                                Humidity (%)
                            </label>
                            <input
                                type="range"
                                min="20"
                                max="100"
                                value={weatherConditions.humidity}
                                onChange={(e) => setWeatherConditions({ ...weatherConditions, humidity: parseInt(e.target.value) })}
                                className="w-full"
                            />
                            <div className="text-right text-sm font-semibold text-blue-600">{weatherConditions.humidity}%</div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <CloudRain size={16} className="text-indigo-500" />
                                Rainfall (mm/day)
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="50"
                                step="0.5"
                                value={weatherConditions.rainfall}
                                onChange={(e) => setWeatherConditions({ ...weatherConditions, rainfall: parseFloat(e.target.value) })}
                                className="w-full"
                            />
                            <div className="text-right text-sm font-semibold text-indigo-600">{weatherConditions.rainfall} mm</div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <Wind size={16} className="text-teal-500" />
                                Wind Speed (km/h)
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="60"
                                value={weatherConditions.windSpeed}
                                onChange={(e) => setWeatherConditions({ ...weatherConditions, windSpeed: parseInt(e.target.value) })}
                                className="w-full"
                            />
                            <div className="text-right text-sm font-semibold text-teal-600">{weatherConditions.windSpeed} km/h</div>
                        </div>

                        <div>
                            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                                <Sun size={16} className="text-yellow-500" />
                                Sunlight (hours/day)
                            </label>
                            <input
                                type="range"
                                min="2"
                                max="14"
                                value={weatherConditions.sunlight}
                                onChange={(e) => setWeatherConditions({ ...weatherConditions, sunlight: parseInt(e.target.value) })}
                                className="w-full"
                            />
                            <div className="text-right text-sm font-semibold text-yellow-600">{weatherConditions.sunlight} hrs</div>
                        </div>
                    </div>

                    {/* Simulation Controls */}
                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2 mb-4">
                            <label className="text-sm font-medium text-gray-700">Speed:</label>
                            <select
                                value={simulationSpeed}
                                onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                                className="p-2 border border-gray-200 rounded-lg text-sm"
                            >
                                <option value="0.5">0.5x</option>
                                <option value="1">1x</option>
                                <option value="2">2x</option>
                                <option value="4">4x</option>
                            </select>
                            <span className="ml-auto flex items-center gap-1 text-sm text-gray-600">
                                <Calendar size={14} />
                                Day {currentDay}/{farmConfig.seasonDuration}
                            </span>
                        </div>

                        <div className="flex gap-2">
                            <Button
                                onClick={isSimulating ? stopSimulation : startSimulation}
                                className={`flex-1 ${isSimulating ? 'bg-orange-500 hover:bg-orange-600' : 'bg-green-500 hover:bg-green-600'}`}
                            >
                                {isSimulating ? <><Pause size={18} /> Pause</> : <><Play size={18} /> Start</>}
                            </Button>
                            <Button onClick={resetSimulation} variant="outline" className="px-4">
                                <RefreshCw size={18} />
                            </Button>
                            <Button onClick={runFullSimulation} variant="outline" className="px-4" disabled={loading}>
                                <SkipForward size={18} />
                            </Button>
                        </div>
                    </div>
                </Card>

                {/* Live Simulation Status */}
                <Card glass className="p-6 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                        <Gauge className="text-purple-500" size={24} />
                        Live Status
                    </h2>

                    <div className="space-y-4">
                        <ProgressBar
                            value={currentSimulation.cropHealth}
                            color="bg-green-500"
                            label="🌱 Crop Health"
                        />
                        <ProgressBar
                            value={currentSimulation.waterLevel}
                            color="bg-blue-500"
                            label="💧 Water Level"
                        />
                        <ProgressBar
                            value={currentSimulation.nutrientLevel}
                            color="bg-amber-500"
                            label="🧪 Nutrient Level"
                        />
                        <ProgressBar
                            value={currentSimulation.pestRisk}
                            color="bg-red-500"
                            label="🐛 Pest Risk"
                        />
                    </div>

                    {/* Live Estimates */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                        <div className="text-center p-3 bg-green-50 rounded-xl">
                            <div className="text-2xl font-bold text-green-600">{currentSimulation.estimatedYield}</div>
                            <div className="text-xs text-gray-500">Est. Yield (tonnes)</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-xl">
                            <div className="text-2xl font-bold text-blue-600">₹{currentSimulation.estimatedProfit}</div>
                            <div className="text-xs text-gray-500">Est. Profit</div>
                        </div>
                    </div>

                    {/* Alerts */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-semibold text-gray-700">Alerts</h3>
                        <AnimatePresence>
                            {currentSimulation.alerts.slice(-3).map((alert, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0 }}
                                    className={`p-2 rounded-lg text-xs flex items-center gap-2 ${
                                        alert.type === 'danger' ? 'bg-red-50 text-red-700' :
                                        alert.type === 'warning' ? 'bg-yellow-50 text-yellow-700' :
                                        'bg-blue-50 text-blue-700'
                                    }`}
                                >
                                    <AlertTriangle size={14} />
                                    {alert.message}
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </Card>
            </div>

            {/* Full Simulation Results */}
            {simulationResults && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <Card glass className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                                <Zap className="text-yellow-500" size={24} />
                                Complete Season Prediction
                            </h2>
                            <button
                                onClick={() => speakText(`Predicted yield is ${simulationResults.predictedYield} tonnes. Estimated profit is ${simulationResults.estimatedProfit} rupees. Risk level is ${simulationResults.riskLevel}.`)}
                                className="p-2 hover:bg-gray-100 rounded-lg"
                            >
                                <Volume2 size={20} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-100">
                                <div className="flex items-center gap-2 text-green-600 mb-2">
                                    <TrendingUp size={20} />
                                    <span className="text-sm font-medium">Predicted Yield</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">{simulationResults.predictedYield}</div>
                                <div className="text-sm text-gray-500">{simulationResults.unit}</div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2 text-blue-600 mb-2">
                                    <DollarSign size={20} />
                                    <span className="text-sm font-medium">Est. Revenue</span>
                                </div>
                                <div className="text-3xl font-bold text-gray-900">₹{simulationResults.estimatedRevenue}</div>
                                <div className="text-sm text-gray-500">at market price</div>
                            </div>

                            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-100">
                                <div className="flex items-center gap-2 text-purple-600 mb-2">
                                    <TrendingUp size={20} />
                                    <span className="text-sm font-medium">Net Profit</span>
                                </div>
                                <div className={`text-3xl font-bold ${parseFloat(simulationResults.estimatedProfit) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ₹{simulationResults.estimatedProfit}
                                </div>
                                <div className="text-sm text-gray-500">{simulationResults.profitMargin}% margin</div>
                            </div>

                            <div className={`p-4 rounded-xl border ${
                                simulationResults.riskLevel === 'Low' ? 'bg-gradient-to-br from-green-50 to-teal-50 border-green-100' :
                                simulationResults.riskLevel === 'Medium' ? 'bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100' :
                                'bg-gradient-to-br from-red-50 to-pink-50 border-red-100'
                            }`}>
                                <div className="flex items-center gap-2 text-gray-600 mb-2">
                                    <AlertTriangle size={20} />
                                    <span className="text-sm font-medium">Risk Level</span>
                                </div>
                                <div className={`text-3xl font-bold ${
                                    simulationResults.riskLevel === 'Low' ? 'text-green-600' :
                                    simulationResults.riskLevel === 'Medium' ? 'text-yellow-600' : 'text-red-600'
                                }`}>
                                    {simulationResults.riskLevel}
                                </div>
                                <div className="text-sm text-gray-500">overall assessment</div>
                            </div>
                        </div>

                        {/* Weather Risks & Recommendations */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">⚠️ Weather Risks</h3>
                                <div className="space-y-3">
                                    {simulationResults.weatherRisks?.map((risk, idx) => (
                                        <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                            <span className="font-medium text-gray-700">{risk.risk}</span>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm text-gray-500">{risk.probability}% chance</span>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    risk.impact === 'Severe' ? 'bg-red-100 text-red-700' :
                                                    risk.impact === 'High' ? 'bg-orange-100 text-orange-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                    {risk.impact}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">💡 Recommendations</h3>
                                <div className="space-y-2">
                                    {simulationResults.recommendations?.map((rec, idx) => (
                                        <div key={idx} className="flex items-start gap-2 p-3 bg-green-50 rounded-xl">
                                            <CheckCircle size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-sm text-gray-700">{rec}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>
            )}
        </motion.div>
    );
};

export default DigitalTwin;
