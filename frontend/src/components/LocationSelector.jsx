import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Loader2, Check } from 'lucide-react';
import { cn } from '../lib/utils';

// States and districts data
const STATES_DISTRICTS = {
    "Telangana": ["Hyderabad", "Warangal", "Karimnagar", "Nizamabad", "Khammam", "Nalgonda", "Medak", "Rangareddy"],
    "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Tirupati", "Kurnool", "Anantapur", "Nellore", "Kadapa"],
    "Maharashtra": ["Pune", "Nagpur", "Nashik", "Aurangabad", "Kolhapur", "Solapur", "Amravati", "Latur"],
    "Karnataka": ["Bangalore", "Mysore", "Belgaum", "Hubli", "Mangalore", "Gulbarga", "Davangere", "Shimoga"],
    "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy", "Salem", "Tirunelveli", "Thanjavur", "Erode"],
    "Punjab": ["Ludhiana", "Amritsar", "Jalandhar", "Patiala"],
    "Haryana": ["Gurgaon", "Karnal", "Hisar"],
    "Uttar Pradesh": ["Lucknow", "Varanasi", "Agra", "Kanpur", "Meerut"],
    "Madhya Pradesh": ["Bhopal", "Indore", "Jabalpur", "Gwalior"],
    "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
    "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
    "West Bengal": ["Kolkata", "Howrah", "Darjeeling"],
    "Bihar": ["Patna", "Gaya", "Muzaffarpur"],
    "Odisha": ["Bhubaneswar", "Cuttack"],
    "Kerala": ["Thiruvananthapuram", "Kochi", "Kozhikode"]
};

const LocationSelector = ({ 
    selectedState, 
    selectedDistrict, 
    onStateChange, 
    onDistrictChange,
    onAutoFill,
    loading = false 
}) => {
    const [districts, setDistricts] = useState([]);
    const [gpsLoading, setGpsLoading] = useState(false);
    const [autoFillLoading, setAutoFillLoading] = useState(false);
    const [autoFilledData, setAutoFilledData] = useState(null);

    // Update districts when state changes
    useEffect(() => {
        if (selectedState && STATES_DISTRICTS[selectedState]) {
            setDistricts(STATES_DISTRICTS[selectedState]);
            // Reset district if current selection is not in new state
            if (!STATES_DISTRICTS[selectedState].includes(selectedDistrict)) {
                onDistrictChange('');
            }
        } else {
            setDistricts([]);
        }
    }, [selectedState]);

    // Get current location using GPS
    const getCurrentLocation = () => {
        setGpsLoading(true);
        
        if (!navigator.geolocation) {
            alert('GPS not supported in your browser');
            setGpsLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    // Use reverse geocoding to get state/district
                    const { latitude, longitude } = position.coords;
                    
                    // Using a free reverse geocoding API
                    const response = await fetch(
                        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&addressdetails=1`
                    );
                    const data = await response.json();
                    
                    if (data.address) {
                        const state = data.address.state || '';
                        const district = data.address.county || data.address.city || data.address.town || '';
                        
                        // Try to match with our available states/districts
                        const matchedState = Object.keys(STATES_DISTRICTS).find(
                            s => state.toLowerCase().includes(s.toLowerCase()) || 
                                 s.toLowerCase().includes(state.toLowerCase())
                        );
                        
                        if (matchedState) {
                            onStateChange(matchedState);
                            
                            // Try to match district
                            const matchedDistrict = STATES_DISTRICTS[matchedState].find(
                                d => district.toLowerCase().includes(d.toLowerCase()) ||
                                     d.toLowerCase().includes(district.toLowerCase())
                            );
                            
                            if (matchedDistrict) {
                                setTimeout(() => onDistrictChange(matchedDistrict), 100);
                            }
                        }
                    }
                } catch (error) {
                    console.error('Geocoding error:', error);
                    alert('Could not detect location. Please select manually.');
                } finally {
                    setGpsLoading(false);
                }
            },
            (error) => {
                console.error('GPS error:', error);
                alert('Could not get your location. Please select manually.');
                setGpsLoading(false);
            }
        );
    };

    // Auto-fill weather and soil data
    const handleAutoFill = async () => {
        if (!selectedState || !selectedDistrict) {
            alert('Please select state and district first');
            return;
        }

        setAutoFillLoading(true);
        
        try {
            const response = await fetch('http://localhost:5001/api/location/auto-fill', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    state: selectedState,
                    district: selectedDistrict
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                setAutoFilledData(data);
                if (onAutoFill) {
                    onAutoFill(data);
                }
            } else {
                alert('Could not fetch data. Using default values.');
            }
        } catch (error) {
            console.error('Auto-fill error:', error);
            alert('Error fetching data. Please try again.');
        } finally {
            setAutoFillLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">📍</span>
                <div>
                    <h3 className="font-semibold text-gray-900">Where is your farm?</h3>
                    <p className="text-sm text-gray-500">आपका खेत कहाँ है? / మీ పొలం ఎక్కడ ఉంది?</p>
                </div>
            </div>

            {/* GPS Button */}
            <motion.button
                type="button"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={getCurrentLocation}
                disabled={gpsLoading}
                className={cn(
                    "w-full p-3 rounded-xl border-2 border-dashed",
                    "flex items-center justify-center gap-2",
                    "text-emerald-600 border-emerald-300 bg-emerald-50/50",
                    "hover:bg-emerald-100 hover:border-emerald-400",
                    "transition-all duration-200",
                    gpsLoading && "opacity-70 cursor-not-allowed"
                )}
            >
                {gpsLoading ? (
                    <Loader2 size={20} className="animate-spin" />
                ) : (
                    <Navigation size={20} />
                )}
                <span className="font-medium">
                    {gpsLoading ? 'Detecting...' : 'Use My Location (GPS)'}
                </span>
            </motion.button>

            <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-sm text-gray-400">or select manually</span>
                <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* State & District Dropdowns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        State (राज्य / రాష్ట్రం)
                    </label>
                    <select
                        value={selectedState}
                        onChange={(e) => onStateChange(e.target.value)}
                        className={cn(
                            "w-full p-3 rounded-xl border border-gray-200",
                            "bg-white text-gray-900",
                            "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                            "transition-all duration-200"
                        )}
                    >
                        <option value="">Select State</option>
                        {Object.keys(STATES_DISTRICTS).map(state => (
                            <option key={state} value={state}>{state}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        District (जिला / జిల్లా)
                    </label>
                    <select
                        value={selectedDistrict}
                        onChange={(e) => onDistrictChange(e.target.value)}
                        disabled={!selectedState}
                        className={cn(
                            "w-full p-3 rounded-xl border border-gray-200",
                            "bg-white text-gray-900",
                            "focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500",
                            "transition-all duration-200",
                            !selectedState && "opacity-50 cursor-not-allowed"
                        )}
                    >
                        <option value="">Select District</option>
                        {districts.map(district => (
                            <option key={district} value={district}>{district}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Auto-fill button */}
            {selectedState && selectedDistrict && (
                <motion.button
                    type="button"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleAutoFill}
                    disabled={autoFillLoading}
                    className={cn(
                        "w-full p-3 rounded-xl",
                        "flex items-center justify-center gap-2",
                        "bg-gradient-to-r from-emerald-500 to-teal-500 text-white",
                        "hover:from-emerald-600 hover:to-teal-600",
                        "shadow-lg shadow-emerald-500/20",
                        "transition-all duration-200",
                        autoFillLoading && "opacity-70 cursor-not-allowed"
                    )}
                >
                    {autoFillLoading ? (
                        <Loader2 size={20} className="animate-spin" />
                    ) : (
                        <MapPin size={20} />
                    )}
                    <span className="font-medium">
                        {autoFillLoading ? 'Getting Data...' : 'Auto-Fill Weather & Soil Data'}
                    </span>
                </motion.button>
            )}

            {/* Auto-filled data display */}
            {autoFilledData && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 bg-gradient-to-br from-blue-50 to-emerald-50 rounded-xl border border-blue-200"
                >
                    <div className="flex items-center gap-2 mb-3">
                        <Check size={18} className="text-emerald-500" />
                        <span className="font-medium text-gray-900">Data Auto-Filled!</span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div className="p-2 bg-white/60 rounded-lg">
                            <p className="text-gray-500">🌡️ Temperature</p>
                            <p className="font-semibold">{autoFilledData.weather?.temperature}°C</p>
                        </div>
                        <div className="p-2 bg-white/60 rounded-lg">
                            <p className="text-gray-500">💧 Humidity</p>
                            <p className="font-semibold">{autoFilledData.weather?.humidity}%</p>
                        </div>
                        <div className="p-2 bg-white/60 rounded-lg">
                            <p className="text-gray-500">🌧️ Rainfall</p>
                            <p className="font-semibold">{autoFilledData.weather?.rainfall} mm</p>
                        </div>
                        <div className="p-2 bg-white/60 rounded-lg">
                            <p className="text-gray-500">🪨 Soil Type</p>
                            <p className="font-semibold capitalize">{autoFilledData.soil?.soil_type?.replace('_', ' ')}</p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default LocationSelector;
export { STATES_DISTRICTS };
