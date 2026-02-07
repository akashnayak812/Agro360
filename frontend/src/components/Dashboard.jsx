import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Sprout,
    Droplets,
    TrendingUp,
    FlaskConical,
    ScanLine,
    Users,
    CloudRain,
    ThermometerSun,
    MapPin,
    Loader2
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

const modules = [
    { title: 'Best Crop', desc: 'Find suitable crops based on soil & climate', path: '/crop', icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { title: 'Fertilizer', desc: 'Get optimal nutrient recommendations', path: '/fertilizer', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Yield Prediction', desc: 'Estimate your future harvest quantity', path: '/yield', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50' },
    { title: 'Soil Health', desc: 'Analyze detailed soil reports', path: '/soil', icon: FlaskConical, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'Plant Doctor', desc: 'Detect diseases from leaf photos', path: '/disease', icon: ScanLine, color: 'text-red-500', bg: 'bg-red-50' },
    { title: 'Community', desc: 'Connect with other farmers', path: '/community', icon: Users, color: 'text-pink-500', bg: 'bg-pink-50' },
];

const Dashboard = () => {
    const { user } = useAuth();
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    const [location, setLocation] = React.useState(null);
    const [locationLoading, setLocationLoading] = React.useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

    const detectLocation = () => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser");
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;
                    const response = await fetch(`${API_URL}/api/location/reverse-geocode`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ lat: latitude, lon: longitude }),
                    });

                    const data = await response.json();
                    if (data.success) {
                        setLocation(data);
                    } else {
                        alert("Could not fetch location details");
                    }
                } catch (error) {
                    console.error("Location Error:", error);
                    alert("Failed to detect location");
                } finally {
                    setLocationLoading(false);
                }
            },
            (error) => {
                console.error("Geolocation Error:", error);
                alert("Please allow location access to use this feature.");
                setLocationLoading(false);
            }
        );
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >

            {/* Header Section */}
            <motion.header variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">
                        Welcome back, {user?.displayName || user?.email?.split('@')[0] || 'Farmer'}
                    </h2>
                    <div className="flex items-center gap-2 mt-1 text-gray-500">
                        {locationLoading ? (
                            <span className="flex items-center gap-1 text-xs">
                                <Loader2 size={12} className="animate-spin" /> Detecting location...
                            </span>
                        ) : (
                            <span className="flex items-center gap-1 text-sm">
                                <MapPin size={14} className="text-agro-green" />
                                {location ? `${location.mandal || location.city}, ${location.district}, ${location.state}` : "Location not detected"}
                            </span>
                        )}

                        {!location && (
                            <button
                                onClick={detectLocation}
                                disabled={locationLoading}
                                className="text-xs text-agro-green font-semibold hover:underline disabled:opacity-50"
                            >
                                {locationLoading ? "Detecting..." : "Detect Location"}
                            </button>
                        )}
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/40 shadow-sm text-sm font-medium text-gray-600">
                        <ThermometerSun size={18} className="text-amber-500" />
                        <span>24°C</span>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-white/40 shadow-sm text-sm font-medium text-gray-600">
                        <CloudRain size={18} className="text-blue-500" />
                        <span>12%</span>
                    </div>
                </div>
            </motion.header>

            {/* Weather Alert */}
            <motion.div variants={item}>
                <Card glass className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 p-8 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 bg-blue-400/10 rounded-full blur-3xl group-hover:bg-blue-400/20 transition-all duration-500" />

                    <div className="relative z-10 flex items-start gap-4">
                        <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                            <CloudRain size={32} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Heavy rain expected tomorrow</h2>
                            <p className="text-gray-600 mt-1 max-w-md">Based on local forecast, we advise preparing drainage systems to prevent waterlogging.</p>
                        </div>
                    </div>

                    <div className="relative z-10 flex-shrink-0">
                        <Link to="/advisory">
                            <Button variant="secondary" className="bg-white text-blue-600 border-blue-200 hover:bg-blue-50">
                                View Advisory
                                <ArrowRight size={18} className="ml-2" />
                            </Button>
                        </Link>
                    </div>
                </Card>
            </motion.div>

            {/* Modules Grid */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {modules.map((mod) => (
                    <Link to={mod.path} key={mod.title} className="block group">
                        <Card hover className="h-full flex flex-col justify-between border-gray-100 bg-white/80">
                            <div>
                                <div className={`w-14 h-14 rounded-2xl ${mod.bg} ${mod.color} flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-300`}>
                                    <mod.icon size={28} />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-agro-green transition-colors">{mod.title}</h3>
                                <p className="text-gray-500 leading-relaxed">{mod.desc}</p>
                            </div>

                            <div className="mt-6 flex items-center text-sm font-semibold text-gray-400 group-hover:text-agro-green transition-colors">
                                <span>Get Started</span>
                                <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Card>
                    </Link>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default Dashboard;
