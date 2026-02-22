import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../lib/api';
import {
    AlertTriangle,
    Shield,
    Bug,
    CloudRain,
    Thermometer,
    Wind,
    Sun,
    Droplets,
    AlertOctagon,
    CheckCircle,
    Clock,
    MapPin,
    Bell,
    BellRing,
    Volume2,
    RefreshCw,
    ChevronRight,
    Zap,
    Target,
    TrendingUp,
    Activity
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const RiskAssessment = () => {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState('rice');
    const [location, setLocation] = useState('Hyderabad');
    const [risks, setRisks] = useState([]);
    const [weatherAlerts, setWeatherAlerts] = useState([]);
    const [pestAlerts, setPestAlerts] = useState([]);
    const [overallRisk, setOverallRisk] = useState(null);
    const [notifications, setNotifications] = useState(true);

    const crops = [
        'rice', 'wheat', 'cotton', 'maize', 'sugarcane', 
        'tomato', 'onion', 'potato', 'soybean', 'groundnut'
    ];

    const locations = [
        'Hyderabad', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai',
        'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
    ];

    // Generate risk data
    const generateRiskData = () => {
        const pestRisks = [
            { name: 'Fall Armyworm', probability: 35, severity: 'High', affectedArea: '15%', trend: 'increasing' },
            { name: 'Aphids', probability: 45, severity: 'Medium', affectedArea: '8%', trend: 'stable' },
            { name: 'Leaf Miner', probability: 25, severity: 'Low', affectedArea: '5%', trend: 'decreasing' },
            { name: 'Stem Borer', probability: 40, severity: 'High', affectedArea: '12%', trend: 'increasing' }
        ];

        const weatherRisks = [
            { type: 'Heavy Rainfall', probability: 60, impact: 'Waterlogging risk', timing: 'Next 48 hours', severity: 'High' },
            { type: 'Heat Wave', probability: 30, impact: 'Crop stress', timing: 'Next week', severity: 'Medium' },
            { type: 'Hailstorm', probability: 15, impact: 'Physical damage', timing: 'Uncertain', severity: 'Severe' },
            { type: 'Drought', probability: 20, impact: 'Water shortage', timing: 'Coming month', severity: 'High' }
        ];

        const diseaseRisks = [
            { name: 'Blast Disease', probability: 40, stage: 'Early detection', action: 'Apply fungicide' },
            { name: 'Bacterial Blight', probability: 25, stage: 'Prevention', action: 'Improve drainage' },
            { name: 'Leaf Spot', probability: 30, stage: 'Monitoring', action: 'Remove affected leaves' }
        ];

        // Calculate overall risk score
        const avgPestRisk = pestRisks.reduce((acc, p) => acc + p.probability, 0) / pestRisks.length;
        const avgWeatherRisk = weatherRisks.reduce((acc, w) => acc + w.probability, 0) / weatherRisks.length;
        const avgDiseaseRisk = diseaseRisks.reduce((acc, d) => acc + d.probability, 0) / diseaseRisks.length;
        const overallScore = ((avgPestRisk + avgWeatherRisk + avgDiseaseRisk) / 3).toFixed(0);

        return {
            pestRisks,
            weatherRisks,
            diseaseRisks,
            overallScore,
            riskLevel: overallScore > 50 ? 'High' : overallScore > 30 ? 'Medium' : 'Low'
        };
    };

    // Generate weather alerts
    const generateWeatherAlerts = () => {
        return [
            {
                id: 1,
                type: 'warning',
                title: 'Heavy Rain Alert',
                message: 'Expected 80mm rainfall in next 48 hours. Prepare drainage systems.',
                time: '2 hours ago',
                icon: CloudRain
            },
            {
                id: 2,
                type: 'info',
                title: 'Temperature Rise',
                message: 'Temperature expected to reach 38°C. Consider shade nets for sensitive crops.',
                time: '5 hours ago',
                icon: Thermometer
            },
            {
                id: 3,
                type: 'success',
                title: 'Favorable Conditions',
                message: 'Good weather window for pesticide application in next 3 days.',
                time: '1 day ago',
                icon: Sun
            }
        ];
    };

    // Generate pest alerts
    const generatePestAlerts = () => {
        return [
            {
                id: 1,
                type: 'danger',
                title: 'Fall Armyworm Outbreak',
                message: 'Detected in nearby regions. Start monitoring and prepare control measures.',
                confidence: 85,
                urgency: 'High'
            },
            {
                id: 2,
                type: 'warning',
                title: 'Aphid Activity Increasing',
                message: 'Rising humidity favors aphid population. Inspect leaf undersides.',
                confidence: 72,
                urgency: 'Medium'
            },
            {
                id: 3,
                type: 'info',
                title: 'Beneficial Insects Active',
                message: 'Natural predators helping control minor pest populations.',
                confidence: 90,
                urgency: 'Low'
            }
        ];
    };

    useEffect(() => {
        fetchRiskData();
    }, [selectedCrop, location]);

    const fetchRiskData = async () => {
        setLoading(true);
        try {
            // Try to fetch from API
            const response = await fetch(`${API_URL}/api/risk/assess`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ crop: selectedCrop, location })
            });
            const data = await response.json();
            if (data.success) {
                setRisks(data.risks);
                setOverallRisk(data.overall);
            } else {
                throw new Error('API failed');
            }
        } catch (error) {
            // Use generated data as fallback
            const riskData = generateRiskData();
            setRisks(riskData);
            setOverallRisk({
                score: riskData.overallScore,
                level: riskData.riskLevel
            });
        }
        setWeatherAlerts(generateWeatherAlerts());
        setPestAlerts(generatePestAlerts());
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

    const getRiskColor = (level) => {
        switch (level?.toLowerCase()) {
            case 'high':
            case 'severe':
                return 'text-red-600 bg-red-100';
            case 'medium':
                return 'text-yellow-600 bg-yellow-100';
            case 'low':
                return 'text-green-600 bg-green-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const getRiskGradient = (score) => {
        if (score > 50) return 'from-red-500 to-orange-500';
        if (score > 30) return 'from-yellow-500 to-amber-500';
        return 'from-green-500 to-emerald-500';
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-red-100 to-orange-100 rounded-2xl text-red-600">
                        <Shield size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Risk Assessment</h1>
                        <p className="text-gray-500">Early warnings for pests, weather & crop risks</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setNotifications(!notifications)}
                        className={`p-2 rounded-lg transition-colors ${
                            notifications ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                        }`}
                        title={notifications ? 'Notifications On' : 'Notifications Off'}
                    >
                        {notifications ? <BellRing size={20} /> : <Bell size={20} />}
                    </button>
                    <Button
                        onClick={fetchRiskData}
                        variant="outline"
                        className="flex items-center gap-2"
                        disabled={loading}
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </Button>
                    <button
                        onClick={() => speakText(`Overall risk level is ${overallRisk?.level || 'moderate'}. There are ${pestAlerts.length} pest alerts and ${weatherAlerts.length} weather alerts. Please check the detailed assessment for more information.`)}
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
                        <Target size={18} className="text-gray-400" />
                        <select
                            value={selectedCrop}
                            onChange={(e) => setSelectedCrop(e.target.value)}
                            className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                        >
                            {crops.map(crop => (
                                <option key={crop} value={crop}>
                                    {crop.charAt(0).toUpperCase() + crop.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <MapPin size={18} className="text-gray-400" />
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-red-500"
                        >
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </Card>

            {/* Overall Risk Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card glass className={`p-6 bg-gradient-to-br ${getRiskGradient(overallRisk?.score || 35)} text-white`}>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold opacity-90">Overall Risk Score</h2>
                        <Activity size={24} className="opacity-80" />
                    </div>
                    <div className="text-6xl font-bold mb-2">{overallRisk?.score || 35}%</div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 bg-white/20 rounded-full text-sm font-medium">
                            {overallRisk?.level || 'Medium'} Risk
                        </span>
                        <span className="text-sm opacity-80">for {selectedCrop}</span>
                    </div>
                </Card>

                {/* Quick Stats */}
                <Card glass className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Bug className="text-red-500" size={20} />
                        Pest Risk Summary
                    </h3>
                    <div className="space-y-3">
                        {risks.pestRisks?.slice(0, 3).map((pest, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{pest.name}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${
                                                pest.probability > 50 ? 'bg-red-500' :
                                                pest.probability > 30 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${pest.probability}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium w-10">{pest.probability}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card glass className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <CloudRain className="text-blue-500" size={20} />
                        Weather Risk Summary
                    </h3>
                    <div className="space-y-3">
                        {risks.weatherRisks?.slice(0, 3).map((weather, idx) => (
                            <div key={idx} className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">{weather.type}</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full ${
                                                weather.probability > 50 ? 'bg-red-500' :
                                                weather.probability > 30 ? 'bg-yellow-500' : 'bg-green-500'
                                            }`}
                                            style={{ width: `${weather.probability}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-medium w-10">{weather.probability}%</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Alerts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weather Alerts */}
                <Card glass className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Zap className="text-yellow-500" size={24} />
                        Weather Alerts
                    </h2>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {weatherAlerts.map((alert, idx) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-4 rounded-xl border-l-4 ${
                                        alert.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                                        alert.type === 'info' ? 'bg-blue-50 border-blue-500' :
                                        'bg-green-50 border-green-500'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            alert.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                            alert.type === 'info' ? 'bg-blue-100 text-blue-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                            <alert.icon size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                                            <span className="text-xs text-gray-400 mt-2 block">{alert.time}</span>
                                        </div>
                                        <button
                                            onClick={() => speakText(`${alert.title}. ${alert.message}`)}
                                            className="p-1 hover:bg-white/50 rounded transition-colors"
                                        >
                                            <Volume2 size={16} className="text-gray-400" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </Card>

                {/* Pest Alerts */}
                <Card glass className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Bug className="text-red-500" size={24} />
                        Pest & Disease Alerts
                    </h2>
                    <div className="space-y-4">
                        <AnimatePresence>
                            {pestAlerts.map((alert, idx) => (
                                <motion.div
                                    key={alert.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className={`p-4 rounded-xl border-l-4 ${
                                        alert.type === 'danger' ? 'bg-red-50 border-red-500' :
                                        alert.type === 'warning' ? 'bg-orange-50 border-orange-500' :
                                        'bg-blue-50 border-blue-500'
                                    }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            alert.type === 'danger' ? 'bg-red-100 text-red-600' :
                                            alert.type === 'warning' ? 'bg-orange-100 text-orange-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                            <AlertTriangle size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                                    alert.urgency === 'High' ? 'bg-red-100 text-red-700' :
                                                    alert.urgency === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-green-100 text-green-700'
                                                }`}>
                                                    {alert.urgency} Priority
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <span className="text-xs text-gray-500">AI Confidence:</span>
                                                <div className="flex-1 max-w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-blue-500 rounded-full"
                                                        style={{ width: `${alert.confidence}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs font-medium text-gray-600">{alert.confidence}%</span>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => speakText(`${alert.title}. ${alert.message}. Priority level is ${alert.urgency}.`)}
                                            className="p-1 hover:bg-white/50 rounded transition-colors"
                                        >
                                            <Volume2 size={16} className="text-gray-400" />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </Card>
            </div>

            {/* Detailed Risk Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Pest Risk Details */}
                <Card glass className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">🐛 Detailed Pest Analysis</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                                    <th className="pb-3 font-medium">Pest</th>
                                    <th className="pb-3 font-medium">Risk %</th>
                                    <th className="pb-3 font-medium">Severity</th>
                                    <th className="pb-3 font-medium">Trend</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {risks.pestRisks?.map((pest, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="py-3 font-medium text-gray-900">{pest.name}</td>
                                        <td className="py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${
                                                            pest.probability > 50 ? 'bg-red-500' :
                                                            pest.probability > 30 ? 'bg-yellow-500' : 'bg-green-500'
                                                        }`}
                                                        style={{ width: `${pest.probability}%` }}
                                                    />
                                                </div>
                                                <span className="text-sm">{pest.probability}%</span>
                                            </div>
                                        </td>
                                        <td className="py-3">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(pest.severity)}`}>
                                                {pest.severity}
                                            </span>
                                        </td>
                                        <td className="py-3">
                                            <span className={`flex items-center gap-1 text-sm ${
                                                pest.trend === 'increasing' ? 'text-red-600' :
                                                pest.trend === 'decreasing' ? 'text-green-600' : 'text-gray-600'
                                            }`}>
                                                {pest.trend === 'increasing' ? <TrendingUp size={14} /> :
                                                 pest.trend === 'decreasing' ? <TrendingUp size={14} className="rotate-180" /> :
                                                 <span className="w-3 h-0.5 bg-gray-400 rounded" />}
                                                {pest.trend}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>

                {/* Disease Risk Details */}
                <Card glass className="p-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">🦠 Disease Risk Analysis</h2>
                    <div className="space-y-4">
                        {risks.diseaseRisks?.map((disease, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="p-4 bg-gray-50 rounded-xl"
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold text-gray-900">{disease.name}</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        disease.probability > 40 ? 'bg-red-100 text-red-700' :
                                        disease.probability > 25 ? 'bg-yellow-100 text-yellow-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>
                                        {disease.probability}% risk
                                    </span>
                                </div>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-gray-500">Stage: <span className="text-gray-700">{disease.stage}</span></span>
                                </div>
                                <div className="mt-2 flex items-center gap-2 text-sm">
                                    <CheckCircle size={14} className="text-green-500" />
                                    <span className="text-gray-600">Recommended: {disease.action}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </Card>
            </div>

            {/* Recommendations */}
            <Card glass className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-green-100">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <CheckCircle className="text-green-500" size={24} />
                    Recommended Actions
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { title: 'Monitor Fields Daily', desc: 'Check for early signs of pest damage, especially leaf undersides', icon: '👁️' },
                        { title: 'Prepare Drainage', desc: 'Heavy rain expected - clear channels and check pump systems', icon: '💧' },
                        { title: 'Apply Neem Oil', desc: 'Natural pest deterrent - spray in early morning or evening', icon: '🌿' },
                        { title: 'Install Pheromone Traps', desc: 'For Fall Armyworm monitoring - place 5 per hectare', icon: '🪤' },
                        { title: 'Adjust Irrigation', desc: 'Reduce watering before expected rainfall to prevent waterlogging', icon: '🚿' },
                        { title: 'Schedule Harvesting', desc: 'Plan harvest before predicted weather disruption', icon: '🌾' }
                    ].map((action, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                        >
                            <div className="flex items-start gap-3">
                                <span className="text-2xl">{action.icon}</span>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">
                                        {action.title}
                                    </h3>
                                    <p className="text-sm text-gray-600 mt-1">{action.desc}</p>
                                </div>
                                <ChevronRight size={18} className="text-gray-400 group-hover:text-green-500 transition-colors" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </Card>
        </motion.div>
    );
};

export default RiskAssessment;
