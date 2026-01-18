import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, Wind, Cloud, Calendar, Thermometer, Droplets } from 'lucide-react';
import { Card } from './ui/Card';

const Advisory = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5001/api/advisory/current')
            .then(res => res.json())
            .then(setData)
            .catch(console.error);
    }, []);

    const WeatherIcon = ({ condition, size = 48 }) => {
        switch (condition) {
            case 'Rainy': return <CloudRain size={size} className="text-blue-500" />;
            case 'Sunny': return <Sun size={size} className="text-amber-500" />;
            case 'Windy': return <Wind size={size} className="text-gray-400" />;
            default: return <Cloud size={size} className="text-gray-400" />;
        }
    };

    if (!data) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-agro-green"></div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8"
        >
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Farming Advisory</h1>
                    <p className="text-gray-500">Real-time weather updates and expert farming tips.</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium text-gray-600">
                    <Calendar size={16} className="text-agro-green" />
                    {data.date}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weather Card */}
                <Card glass className="col-span-1 lg:col-span-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-none p-8 relative overflow-hidden">
                    <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                    <div className="absolute left-0 bottom-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-16 -mb-16"></div>

                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-6">
                            <div className="p-4 bg-white/20 backdrop-blur-md rounded-3xl">
                                <WeatherIcon condition={data.weather.condition} size={64} className="text-white" />
                            </div>
                            <div>
                                <div className="text-6xl font-bold tracking-tight">{data.weather.temperature}°</div>
                                <div className="text-blue-100 text-lg font-medium">{data.weather.condition}</div>
                            </div>
                        </div>

                        <div className="flex gap-8 text-center">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 min-w-[120px] border border-white/10">
                                <Droplets size={24} className="mx-auto mb-2 text-blue-200" />
                                <div className="text-2xl font-bold">{data.weather.humidity}%</div>
                                <div className="text-xs text-blue-200">Humidity</div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 min-w-[120px] border border-white/10">
                                <Wind size={24} className="mx-auto mb-2 text-blue-200" />
                                <div className="text-2xl font-bold">12 <span className="text-sm font-normal">km/h</span></div>
                                <div className="text-xs text-blue-200">Wind Speed</div>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Advice Lists */}
                <Card className="col-span-1 lg:col-span-2 p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                        <span className="w-2 h-8 bg-agro-green rounded-full"></span>
                        Recommended Actions
                    </h3>
                    <div className="space-y-4">
                        {data.farming_advice.map((tip, idx) => (
                            <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-colors duration-300">
                                <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold text-sm">
                                    {idx + 1}
                                </div>
                                <p className="text-gray-700 leading-relaxed font-medium pt-1">{tip}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                <Card className="col-span-1 p-8 bg-amber-50 border-amber-100">
                    <h3 className="text-xl font-bold text-amber-800 mb-6 flex items-center gap-2">
                        <Sun size={24} className="text-amber-500" />
                        Sowing Tips
                    </h3>
                    <p className="text-amber-900/80 leading-relaxed">
                        {data.sowing_recommendation}
                    </p>
                    <div className="mt-8 pt-6 border-t border-amber-200">
                        <div className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-2">Best time to plant</div>
                        <div className="text-2xl font-bold text-amber-900">Morning 6-8 AM</div>
                    </div>
                </Card>
            </div>
        </motion.div>
    );
};

export default Advisory;
