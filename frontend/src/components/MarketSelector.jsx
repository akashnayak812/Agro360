import { Card } from './ui/Card';
import { motion } from 'framer-motion';

const MarketSelector = ({
    states,
    markets,
    crops,
    selectedState,
    selectedMarket,
    selectedCrop,
    onStateChange,
    onMarketChange,
    onCropChange,
    loadingStates,
    loadingMarkets,
    loadingCrops
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
        >
            <Card glass className="p-7 mb-8 bg-white/40 dark:bg-gray-900/40 border border-white/40 dark:border-gray-700/50 shadow-xl backdrop-blur-xl rounded-2xl">
                <h3 className="text-xl font-bold mb-6 text-emerald-800 dark:text-emerald-400 flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
                    Filter Context
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-emerald-800 dark:text-emerald-200">State</label>
                        <div className="relative group">
                            <select
                                value={selectedState}
                                onChange={(e) => onStateChange(e.target.value)}
                                className="w-full p-3.5 bg-white/70 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 backdrop-blur-md border-2 border-emerald-200/50 hover:border-emerald-400 dark:border-gray-700 dark:hover:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 outline-none text-emerald-900 dark:text-emerald-50 font-medium transition-all shadow-sm appearance-none cursor-pointer"
                                disabled={loadingStates}
                            >
                                <option value="" className="text-gray-500">{loadingStates ? "Loading states..." : "Select State"}</option>
                                {states.map(state => (
                                    <option key={state} value={state} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">{state}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-emerald-800 dark:text-emerald-200">Market</label>
                        <div className="relative group">
                            <select
                                value={selectedMarket}
                                onChange={(e) => onMarketChange(e.target.value)}
                                className="w-full p-3.5 bg-white/70 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 backdrop-blur-md border-2 border-emerald-200/50 hover:border-emerald-400 dark:border-gray-700 dark:hover:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 outline-none text-emerald-900 dark:text-emerald-50 font-medium transition-all shadow-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!selectedState || loadingMarkets}
                            >
                                <option value="" className="text-gray-500">{loadingMarkets ? "Loading markets..." : "Select Market"}</option>
                                {markets.map(market => (
                                    <option key={market} value={market} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">{market}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-emerald-800 dark:text-emerald-200">Crop</label>
                        <div className="relative group">
                            <select
                                value={selectedCrop}
                                onChange={(e) => onCropChange(e.target.value)}
                                className="w-full p-3.5 bg-white/70 hover:bg-white dark:bg-gray-800/80 dark:hover:bg-gray-800 backdrop-blur-md border-2 border-emerald-200/50 hover:border-emerald-400 dark:border-gray-700 dark:hover:border-emerald-500 rounded-xl focus:ring-4 focus:ring-emerald-500/20 outline-none text-emerald-900 dark:text-emerald-50 font-medium transition-all shadow-sm appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!selectedMarket || loadingCrops}
                            >
                                <option value="" className="text-gray-500">{loadingCrops ? "Loading crops..." : "Select Crop"}</option>
                                {crops.map(crop => (
                                    <option key={crop} value={crop} className="text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800">{crop}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-emerald-600 dark:text-emerald-400 group-hover:text-emerald-700 transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default MarketSelector;
