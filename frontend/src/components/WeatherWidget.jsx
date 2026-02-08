import React from 'react';
import { motion } from 'framer-motion';
import { CloudRain, Sun, Cloud, Wind, Droplets } from 'lucide-react';

const WeatherWidget = ({ location }) => {
    // Mock data - in a real app, fetch from API based on location
    const weather = {
        temp: 24,
        condition: 'Partly Cloudy',
        humidity: 65,
        wind: 12,
        forecast: [
            { day: 'Mon', temp: 25, icon: Sun },
            { day: 'Tue', temp: 22, icon: CloudRain },
            { day: 'Wed', temp: 24, icon: Cloud },
        ]
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-agro-sky/20 to-agro-water-light/30 backdrop-blur-md rounded-3xl p-6 border border-white/40 shadow-xl relative overflow-hidden"
        >
            {/* Animated Background Elements */}
            <motion.div
                animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                transition={{ duration: 8, repeat: Infinity }}
                className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-agro-sun/20 rounded-full blur-3xl"
            />

            <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Current Weather</h3>
                        <p className="text-gray-900 font-semibold mt-1">{location?.city || 'Local Farm'}</p>
                    </div>
                    <div className="p-3 bg-white/50 rounded-2xl shadow-sm">
                        <Sun className="text-agro-sun-dark w-6 h-6" />
                    </div>
                </div>

                <div className="flex items-center gap-4 mb-6">
                    <span className="text-5xl font-bold text-gray-800">{weather.temp}°</span>
                    <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-lg text-gray-800">{weather.condition}</p>
                        <p>H: {weather.temp + 2}° L: {weather.temp - 3}°</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center gap-3 p-3 bg-white/40 rounded-xl">
                        <Droplets className="text-agro-water-dark w-5 h-5" />
                        <div>
                            <p className="text-xs text-gray-500">Humidity</p>
                            <p className="font-semibold text-gray-800">{weather.humidity}%</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white/40 rounded-xl">
                        <Wind className="text-gray-500 w-5 h-5" />
                        <div>
                            <p className="text-xs text-gray-500">Wind</p>
                            <p className="font-semibold text-gray-800">{weather.wind} km/h</p>
                        </div>
                    </div>
                </div>

                {/* Mini Forecast */}
                <div className="flex justify-between items-center border-t border-white/30 pt-4">
                    {weather.forecast.map((day, idx) => (
                        <div key={idx} className="text-center group cursor-pointer">
                            <p className="text-xs text-gray-500 mb-1">{day.day}</p>
                            <day.icon className="w-5 h-5 mx-auto text-gray-700 group-hover:text-agro-green transition-colors" />
                            <p className="text-sm font-medium text-gray-800 mt-1">{day.temp}°</p>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
};

export default WeatherWidget;
