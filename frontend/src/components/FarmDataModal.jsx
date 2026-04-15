import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, IndianRupee, Map, Layers, Save, X } from 'lucide-react';
import { Button } from './ui/Button';
import { useAuth } from '../context/AuthContext';
import { API_URL } from '../lib/api';

const FarmDataModal = ({ isOpen, onClose, onSave, existingData }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        activeCrops: 0,
        monthlyIncome: 0,
        landArea: 0,
    });

    useEffect(() => {
        if (existingData) {
            setFormData({
                activeCrops: existingData.activeCrops || 0,
                monthlyIncome: existingData.monthlyIncome || 0,
                landArea: existingData.landArea || 0,
            });
        }
    }, [existingData, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;
        
        setLoading(true);
        try {
            const method = existingData ? 'PUT' : 'POST';
            const url = existingData 
                ? `${API_URL}/api/farm-data/${user.uid}` 
                : `${API_URL}/api/farm-data`;
                
            const payload = { ...formData, userId: user.uid };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            if (result.success) {
                if (onSave) onSave(result.data);
                if (onClose) onClose();
            } else {
                alert(result.message || "Failed to save data. Please try again.");
            }
        } catch (error) {
            console.error("Error saving farm data:", error);
            alert("Error connecting to the server.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-6 relative overflow-hidden"
                    onClick={e => e.stopPropagation()}
                >
                    {existingData && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} className="text-gray-500" />
                        </button>
                    )}

                    <div className="mb-6 border-b pb-4">
                        <h2 className="text-2xl font-extrabold text-agro-darkGreen flex items-center gap-2">
                            <Layers className="text-agro-green" size={28} />
                            {existingData ? "Edit Farm Details" : "Enter Your Farm Details"}
                        </h2>
                        <p className="text-gray-500 text-sm mt-1">
                            {existingData 
                                ? "Update your farming data to track your revenue accurately." 
                                : "Help us personalize your dashboard by providing some details."}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Active Crops</label>
                            <div className="relative">
                                <Sprout size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="activeCrops"
                                    min="0"
                                    value={formData.activeCrops || ''}
                                    onChange={handleChange}
                                    placeholder="Number of crops currently growing"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-agro-green/50 outline-none transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Monthly Income (₹)</label>
                            <div className="relative">
                                <IndianRupee size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="monthlyIncome"
                                    min="0"
                                    step="100"
                                    value={formData.monthlyIncome || ''}
                                    onChange={handleChange}
                                    placeholder="Average monthly income"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-agro-green/50 outline-none transition-all text-sm"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-1 text-gray-700">Land Area (Acres) <span className="text-gray-400 font-normal">(Optional)</span></label>
                            <div className="relative">
                                <Map size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="number"
                                    name="landArea"
                                    min="0"
                                    step="0.1"
                                    value={formData.landArea || ''}
                                    onChange={handleChange}
                                    placeholder="Total land area in acres"
                                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-agro-green/50 outline-none transition-all text-sm"
                                />
                            </div>
                        </div>

                        <div className="mt-8 pt-4 border-t flex justify-end gap-3">
                            {existingData && (
                                <Button type="button" variant="outline" onClick={onClose} className="rounded-xl">
                                    Cancel
                                </Button>
                            )}
                            <Button type="submit" disabled={loading} className="bg-agro-green hover:bg-agro-darkGreen text-white rounded-xl flex items-center gap-2">
                                <Save size={18} />
                                {loading ? "Saving..." : "Save Details"}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FarmDataModal;
