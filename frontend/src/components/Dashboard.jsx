import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { API_URL } from '../lib/api';
import {
    ArrowRight,
    Sprout,
    Droplets,
    TrendingUp,
    FlaskConical,
    ScanLine,
    Users,
    MapPin,
    Loader2,
    Calendar,
    Activity,
    DollarSign
} from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import WeatherWidget from './WeatherWidget';
import StatCard from './StatCard';
import FarmProfileModal from './FarmProfileModal';
import FarmDataModal from './FarmDataModal';
import LocationWidget from './LocationWidget';
import { Layers } from 'lucide-react';

const Dashboard = () => {
    const { t } = useTranslation();
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

    const [isProfileModalOpen, setIsProfileModalOpen] = React.useState(false);
    const [farmData, setFarmData] = React.useState(null);
    const [isFarmDataModalOpen, setIsFarmDataModalOpen] = React.useState(false);
    const [loadingFarmData, setLoadingFarmData] = React.useState(true);

    React.useEffect(() => {
        const fetchFarmData = async () => {
            if (!user) return;
            try {
                const response = await fetch(`${API_URL}/api/farm-data/${user.uid}`);
                const result = await response.json();
                if (result.success && result.data) {
                    setFarmData(result.data);
                } else {
                    setIsFarmDataModalOpen(true);
                }
            } catch (error) {
                console.error("Failed to fetch farm data", error);
            } finally {
                setLoadingFarmData(false);
            }
        };
        fetchFarmData();
    }, [user]);

    // Revenue Calculation Logic
    const activeCrops = farmData?.activeCrops || 0;
    const monthlyIncome = farmData?.monthlyIncome || 0;
    const annualRevenue = (monthlyIncome * 12) + (activeCrops * 5000);

    const formattedMonthlyIncome = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(monthlyIncome);
    const formattedRevenue = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(annualRevenue);

    const modules = [
        { title: t('dashboard.bestCrop'), desc: t('dashboard.bestCropDesc'), path: '/crop', icon: Sprout, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        { title: t('nav.fertilizer'), desc: t('dashboard.fertilizerDesc'), path: '/fertilizer', icon: Droplets, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
        { title: t('nav.yield'), desc: t('dashboard.yieldPredDesc'), path: '/yield', icon: TrendingUp, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
        { title: t('nav.soil'), desc: t('dashboard.soilHealthDesc'), path: '/soil', icon: FlaskConical, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
        { title: t('dashboard.plantDoctor'), desc: t('dashboard.plantDoctorDesc'), path: '/disease', icon: ScanLine, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100' },
        { title: t('nav.community'), desc: t('dashboard.communityDesc'), path: '/community', icon: Users, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-100' },
    ];



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
                    <h2 className="text-3xl font-heading font-bold text-gray-800">
                        {t('dashboard.hello')}, {user?.displayName || user?.email?.split('@')[0] || t('dashboard.farmer')}! 👋
                    </h2>
                    <div className="flex items-center gap-2 mt-2 text-gray-500 font-medium">
                        <span className="text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => setIsFarmDataModalOpen(true)} className="hidden md:flex gap-2 border-blue-500/30 text-blue-600 hover:bg-blue-500/10">
                        <DollarSign size={16} /> Edit Data
                    </Button>
                    <Button variant="outline" onClick={() => setIsProfileModalOpen(true)} className="hidden md:flex gap-2 border-agro-green/30 text-agro-green hover:bg-agro-green/10">
                        <Layers size={16} /> Farm Profile
                    </Button>
                    <Button variant="outline" className="hidden md:flex gap-2">
                        <Calendar size={16} /> {t('dashboard.schedule')}
                    </Button>
                    <Link to="/advisory">
                        <Button className="bg-agro-green hover:bg-agro-darkGreen text-white shadow-lg shadow-agro-green/20">
                            {t('dashboard.viewAlerts')}
                        </Button>
                    </Link>
                </div>
            </motion.header>

            {/* Universal Location Widget */}
            <motion.div variants={item}>
                <LocationWidget />
            </motion.div>

            {/* Main Dashboard Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Stats & Quick Actions */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Stats Row */}
                    <motion.div variants={item} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <StatCard
                            title="Active Crops"
                            value={loadingFarmData ? "..." : activeCrops.toString()}
                            icon={Sprout}
                            color="amber"
                            delay={0.1}
                        />
                        <StatCard
                            title="Monthly Income"
                            value={loadingFarmData ? "..." : formattedMonthlyIncome}
                            icon={DollarSign}
                            color="blue"
                            delay={0.2}
                        />
                        <StatCard
                            title="Annual Revenue"
                            value={loadingFarmData ? "..." : formattedRevenue}
                            icon={TrendingUp}
                            color="emerald"
                            delay={0.3}
                        />
                    </motion.div>

                    {/* Crop Growth Simulation */}
                    <motion.div variants={item}>
                        <Card className="p-6 bg-white/60 backdrop-blur-md border border-white/40 shadow-lg relative overflow-hidden">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                    <Sprout className="text-agro-green" size={20} />
                                    {t('dashboard.cropGrowthTracking')}
                                </h3>
                                <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{t('dashboard.season')}</span>
                            </div>

                            <div className="space-y-6">
                                {/* Crop Item 1 */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-gray-700">{t('dashboard.paddyRice')}</span>
                                        <span className="text-agro-green font-bold">75% - {t('dashboard.harvestingSoon')}</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '75%' }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-agro-lightGreen to-agro-darkGreen rounded-full relative"
                                        >
                                            <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]" />
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Crop Item 2 */}
                                <div>
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="font-medium text-gray-700">{t('dashboard.cotton')}</span>
                                        <span className="text-amber-500 font-bold">40% - {t('dashboard.floweringStage')}</span>
                                    </div>
                                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '40%' }}
                                            transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                                            className="h-full bg-gradient-to-r from-amber-300 to-amber-500 rounded-full relative"
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>

                    {/* Quick Access Modules */}
                    <motion.div variants={item}>
                        <h3 className="text-lg font-bold text-gray-800 mb-4 px-1">{t('dashboard.farmTools')}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {modules.map((mod) => (
                                <Link to={mod.path} key={mod.path} className="block group">
                                    <Card hover className={`h-full border ${mod.border} bg-white/90 backdrop-blur transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}>
                                        <div className="p-5 flex flex-col h-full justify-between">
                                            <div className="flex justify-between items-start">
                                                <div className={`p-3 rounded-2xl ${mod.bg} ${mod.color} transition-transform group-hover:scale-110 duration-300`}>
                                                    <mod.icon size={24} />
                                                </div>
                                                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                                                    <ArrowRight size={20} />
                                                </div>
                                            </div>
                                            <div className="mt-4">
                                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-agro-green transition-colors">{mod.title}</h3>
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{mod.desc}</p>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Right Column: Weather & Activity */}
                <div className="space-y-8">
                    <motion.div variants={item}>
                        <WeatherWidget location={location} />
                    </motion.div>

                    {/* Recent Activity / Advisory */}
                    <motion.div variants={item}>
                        <Card className="p-6 bg-white/80 backdrop-blur-md border border-gray-100 shadow-lg">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">{t('dashboard.farmAdvisory')}</h3>
                            <div className="space-y-4">
                                <div className="flex gap-3 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-red-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{t('dashboard.pestAlert')}</p>
                                        <p className="text-xs text-gray-500 mt-1">{t('dashboard.pestAlertDesc')}</p>
                                        <Link to="/disease" className="text-xs text-red-500 font-medium hover:underline mt-1 block">{t('dashboard.checkPlantDoctor')}</Link>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{t('dashboard.irrigation')}</p>
                                        <p className="text-xs text-gray-500 mt-1">{t('dashboard.irrigationDesc')}</p>
                                    </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                    <div>
                                        <p className="text-sm font-semibold text-gray-800">{t('dashboard.fertilizerAlert')}</p>
                                        <p className="text-xs text-gray-500 mt-1">{t('dashboard.fertilizerAlertDesc')}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </motion.div>
                </div>

            </div>

            <FarmProfileModal 
                isOpen={isProfileModalOpen} 
                onClose={() => setIsProfileModalOpen(false)} 
            />

            <FarmDataModal
                isOpen={isFarmDataModalOpen}
                onClose={() => {
                    // Only allow closing if data exists
                    if (farmData) {
                        setIsFarmDataModalOpen(false);
                    }
                }}
                onSave={(data) => {
                    setFarmData(data);
                    setIsFarmDataModalOpen(false);
                }}
                existingData={farmData}
            />
        </motion.div>
    );
};

export default Dashboard;
