import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Sprout,
    Droplets,
    TrendingUp,
    FlaskConical,
    ScanLine,
    CloudSun,
    Users,
    Menu,
    X,
    Leaf,
    LogOut,
    LogIn,
    Code2
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navItems = [
        { path: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
        { path: '/crop', icon: Sprout, label: t('nav.crop') },
        { path: '/fertilizer', icon: Droplets, label: t('nav.fertilizer') },
        { path: '/yield', icon: TrendingUp, label: t('nav.yield') },
        { path: '/soil', icon: FlaskConical, label: t('nav.soil') },
        { path: '/disease', icon: ScanLine, label: t('nav.disease') },
        { path: '/advisory', icon: CloudSun, label: t('nav.advisory') },
        { path: '/community', icon: Users, label: t('nav.community') },
        { path: '/developer', icon: Code2, label: 'Developer' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const UserProfile = () => (
        <div className="p-4 rounded-2xl bg-gradient-to-br from-white/40 to-white/10 border border-white/30 backdrop-blur-sm">
            {user ? (
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-agro-earth/10 flex items-center justify-center text-agro-earth font-bold">
                            {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-semibold text-gray-800 truncate max-w-[100px]">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate max-w-[100px]">{user.role || 'Farmer'}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-red-50 rounded-lg text-gray-500 hover:text-red-500 transition-colors"
                        title="Logout"
                    >
                        <LogOut size={18} />
                    </button>
                </div>
            ) : (
                <NavLink
                    to="/login"
                    className="flex items-center gap-3 w-full p-2 hover:bg-white/50 rounded-lg transition-colors group"
                >
                    <div className="h-10 w-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 group-hover:text-agro-green group-hover:bg-agro-green/10 transition-colors">
                        <LogIn size={20} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-gray-800">Sign In</p>
                        <p className="text-xs text-gray-500">Access your account</p>
                    </div>
                </NavLink>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile Toggle */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-white/80 backdrop-blur-md shadow-lg border border-white/20 text-agro-darkGreen"
            >
                {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar Container */}
            <motion.aside
                initial={false}
                animate={{
                    width: isOpen ? '280px' : '0px',
                    opacity: isOpen ? 1 : 0
                }}
                className={cn(
                    "fixed top-0 left-0 h-screen z-40 overflow-hidden",
                    "hidden lg:block lg:relative" // Always relative on desktop, handled by parent flex
                )}
                style={{ width: 280 }} // Default width for server/initial render
            >
                <div className="h-full m-4 ml-4 rounded-3xl glass border border-white/40 flex flex-col">
                    {/* Header */}
                    <div className="p-8 flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-agro-green to-agro-darkGreen flex items-center justify-center shadow-lg shadow-agro-green/30 text-white">
                            <Leaf size={24} fill="currentColor" />
                        </div>
                        <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-agro-darkGreen to-agro-green bg-clip-text text-transparent">
                            Agro360
                        </h1>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto custom-scrollbar">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    cn(
                                        "relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group font-medium",
                                        isActive
                                            ? "text-white shadow-lg shadow-agro-green/25"
                                            : "text-gray-500 hover:text-agro-green hover:bg-white/50"
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNav"
                                                className="absolute inset-0 bg-gradient-to-r from-agro-green to-agro-darkGreen rounded-xl"
                                                initial={false}
                                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                            />
                                        )}
                                        <item.icon
                                            size={20}
                                            className={cn("relative z-10", isActive ? "text-white" : "text-gray-400 group-hover:text-agro-green")}
                                        />
                                        <span className={cn("relative z-10", isActive ? "text-white" : "")}>
                                            {item.label}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Footer/User Profile */}
                    <div className="p-4 mt-auto">
                        <UserProfile />
                    </div>
                </div>
            </motion.aside>

            {/* Mobile Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/20 z-30 backdrop-blur-sm"
                    >
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: "spring", damping: 20 }}
                            className="absolute top-0 left-0 h-full w-[280px]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="h-full p-4">
                                <div className="h-full rounded-3xl glass border border-white/40 flex flex-col bg-white/90">
                                    {/* Duplicate content for mobile - slightly hacky but effective for now. Ideally componentize nav content. */}
                                    <div className="p-8 flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-agro-green to-agro-darkGreen flex items-center justify-center shadow-lg shadow-agro-green/30 text-white">
                                            <Leaf size={24} fill="currentColor" />
                                        </div>
                                        <h1 className="text-2xl font-heading font-bold bg-gradient-to-r from-agro-darkGreen to-agro-green bg-clip-text text-transparent">
                                            Agro360
                                        </h1>
                                    </div>

                                    <nav className="flex-1 px-4 py-2 space-y-2 overflow-y-auto">
                                        {navItems.map((item) => (
                                            <NavLink
                                                key={item.path}
                                                to={item.path}
                                                onClick={() => setIsOpen(false)}
                                                className={({ isActive }) =>
                                                    cn(
                                                        "relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 group font-medium",
                                                        isActive
                                                            ? "bg-gradient-to-r from-agro-green to-agro-darkGreen text-white shadow-lg shadow-agro-green/25"
                                                            : "text-gray-500 hover:text-agro-green hover:bg-black/5"
                                                    )
                                                }
                                            >
                                                <item.icon
                                                    size={20}
                                                />
                                                <span>{item.label}</span>
                                            </NavLink>
                                        ))}
                                    </nav>
                                </div>
                            </div>
                        </motion.aside>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
