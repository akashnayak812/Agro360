import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Leaf, Activity, Droplets, Thermometer, Wind, CloudRain } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const CropRecommendation = () => {
    const [formData, setFormData] = useState({
        N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/crop/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                        <Sprout size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Crop Recommendation</h1>
                        <p className="text-gray-500">AI-powered suggestions for the best crop for your soil condition.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5">
                        <option value="en">English</option>
                        <option value="hi">हिंदी</option>
                        <option value="te">తెలుగు</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card glass className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {result && !result.success && (
                            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                ⚠️ {result.error || "An error occurred. Please check your inputs and try again."}
                            </div>
                        )}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Soil Nutrients (मृदा पोषक तत्व)</h3>
                            <div className="text-xs text-gray-500 mb-2">💡 Ask lab for these values or use soil test kit</div>
                            <div className="grid grid-cols-1 gap-3">
                                <div>
                                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                        🌿 Leaf Growth (पत्ती)
                                    </label>
                                    <Input
                                        name="N"
                                        type="number"
                                        placeholder="Enter N value"
                                        onChange={handleChange}
                                        required
                                        icon={Activity}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                        🌺 Flowers (फूल)
                                    </label>
                                    <Input
                                        name="P"
                                        type="number"
                                        placeholder="Enter P value"
                                        onChange={handleChange}
                                        required
                                        icon={Activity}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                        💪 Strength (ताकत)
                                    </label>
                                    <Input
                                        name="K"
                                        type="number"
                                        placeholder="Enter K value"
                                        onChange={handleChange}
                                        required
                                        icon={Activity}
                                    />
                                </div>
                            </div>
                            <Input
                                name="ph"
                                type="number"
                                step="0.1"
                                placeholder="pH Level (0-14)"
                                onChange={handleChange}
                                required
                                icon={Activity}
                            />
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Environmental Factors</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <Input
                                    name="temperature"
                                    type="number"
                                    step="0.1"
                                    placeholder="Temp (°C)"
                                    onChange={handleChange}
                                    icon={Thermometer}
                                />
                                <Input
                                    name="humidity"
                                    type="number"
                                    step="0.1"
                                    placeholder="Humidity (%)"
                                    onChange={handleChange}
                                    icon={Wind}
                                />
                                <Input
                                    name="rainfall"
                                    type="number"
                                    step="0.1"
                                    placeholder="Rainfall (mm)"
                                    onChange={handleChange}
                                    icon={CloudRain}
                                />
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-lg h-12"
                            isLoading={loading}
                        >
                            {loading ? 'Analyzing Soil Data...' : 'Get Recommendation'}
                        </Button>
                    </form>
                </Card>

                <div className="space-y-6">
                    {result ? (
                        <Card className="p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-100 h-full flex flex-col justify-center items-center text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6"
                            >
                                <Leaf size={48} />
                            </motion.div>
                            <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider mb-2">Best Crop to Grow</h3>
                            <h2 className="text-5xl font-bold text-gray-900 mb-4 capitalize">{result.crop}</h2>
                            <p className="text-gray-600 max-w-sm mb-8">{result.message || "This crop is highly suitable for your current soil and weather conditions."}</p>

                            <div className="bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-emerald-200 text-emerald-700 font-medium">
                                AI Confidence: <span className="font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                            </div>
                        </Card>
                    ) : (
                        <Card className="h-full flex flex-col justify-center items-center text-center p-8 bg-gray-50/50 border-dashed">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <Sprout size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">No Analysis Yet</h3>
                            <p className="text-gray-500 max-w-xs mt-2">Fill out the form with your soil data to get accurate crop recommendations.</p>
                        </Card>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CropRecommendation;
