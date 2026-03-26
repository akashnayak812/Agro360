import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Sprout, Layers, Maximize, X, CheckCircle, Save } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';

const FarmProfileModal = ({ isOpen, onClose, onSave }) => {
    const { user } = useAuth();
    const storageKey = `agro360_farm_profile_${user?.uid || 'guest'}`;

    const [formData, setFormData] = useState({
        state: '',
        district: '',
        defaultCrop: '',
        fieldArea: '',
        soilType: ''
    });

    useEffect(() => {
        if (isOpen) {
            const savedProfile = localStorage.getItem(storageKey);
            if (savedProfile) {
                try {
                    setFormData(JSON.parse(savedProfile));
                } catch (e) {
                    console.error("Failed to parse saved profile");
                }
            }
        }
    }, [isOpen, storageKey]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        localStorage.setItem(storageKey, JSON.stringify(formData));
        if (onSave) onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-6 relative overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                    >
                        <X size={20} className="text-gray-500" />
                    </button>

                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-extrabold text-agro-darkGreen flex items-center gap-2">
                            <Layers className="text-agro-green" size={28} />
                            My Farm Profile
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            Save your farm details to auto-fill tools like the Simulator, Advisory, and Soil forms.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">State</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="state"
                                        value={formData.state}
                                        onChange={handleChange}
                                        placeholder="E.g., Telangana"
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-agro-green/50 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-1 text-gray-700">District</label>
                                <div className="relative">
                                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        name="district"
                                        value={formData.district}
                                        onChange={handleChange}
                                        placeholder="E.g., Warangal"
                                        className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-agro-green/50 outline-none transition-all text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Primary Crop</label>
                            <div className="relative">
                                <Sprout size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    name="defaultCrop"
                                    value={formData.defaultCrop}
                                    onChange={handleChange}
                                    placeholder="E.g., Rice, Cotton"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-agro-green/50 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Field Area (Acres)</label>
                            <div className="relative">
                                <Maximize size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="fieldArea"
                                    value={formData.fieldArea}
                                    onChange={handleChange}
                                    placeholder="E.g., 5"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-agro-green/50 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Soil Type</label>
                            <div className="relative">
                                <Layers size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <select
                                    name="soilType"
                                    value={formData.soilType}
                                    onChange={handleChange}
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-agro-green/50 outline-none transition-all text-sm appearance-none"
                                >
                                    <option value="">Select Soil Type</option>
                                    <option value="Red Soil">Red Soil</option>
                                    <option value="Black Soil (Cotton Soil)">Black Soil</option>
                                    <option value="Alluvial Soil">Alluvial Soil</option>
                                    <option value="Laterite Soil">Laterite Soil</option>
                                    <option value="Loamy Soil">Loamy Soil</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-4 border-t flex justify-end gap-3">
                        <Button variant="outline" onClick={onClose} className="rounded-xl">
                            Cancel
                        </Button>
                        <Button onClick={handleSave} className="bg-agro-green hover:bg-agro-darkGreen text-white rounded-xl flex items-center gap-2">
                            <Save size={18} />
                            Save Profile
                        </Button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FarmProfileModal;
