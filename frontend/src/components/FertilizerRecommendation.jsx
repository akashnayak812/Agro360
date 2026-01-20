import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Droplets, Sprout, Activity, Beaker } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import FertilizerCard from './FertilizerCard';

const FertilizerRecommendation = () => {
    const [formData, setFormData] = useState({
        N: '', P: '', K: '', ph: '', crop: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Farmer-friendly fertilizer info
    const fertilizerInfo = {
        'Urea': {
            localName: 'यूरिया (पत्ती वृद्धि के लिए)',
            description: 'Best for making plants green and increasing leaf growth. Use when leaves turn yellow.',
            benefits: ['Makes plants green', 'Increases leaf size', 'Good for leafy vegetables']
        },
        'DAP': {
            localName: 'डीएपी (फूल और फल के लिए)',
            description: 'Perfect for flowering and fruiting. Use during flowering season.',
            benefits: ['More flowers', 'Better fruit quality', 'Strong root development']
        },
        'MOP': {
            localName: 'एमओपी (पौधों की ताकत)',
            description: 'Strengthens plants and makes them disease-resistant. Use for overall plant health.',
            benefits: ['Disease resistance', 'Strong stems', 'Better water management']
        },
        'NPK': {
            localName: 'एनपीके (संपूर्ण पोषण)',
            description: 'Complete nutrition for your crop. Contains all three essential nutrients.',
            benefits: ['Balanced growth', 'Good for all stages', 'Easy to use']
        },
        'Compost': {
            localName: 'जैविक खाद (गोबर/कंपोस्ट)',
            description: 'Natural fertilizer from cow dung or organic waste. Best for soil health.',
            benefits: ['Improves soil quality', 'Long lasting', 'Eco-friendly']
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch('http://localhost:5001/api/fertilizer/recommend', {
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
                    <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                        <Droplets size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Fertilizer Advisor</h1>
                        <p className="text-gray-500">Get the perfect fertilizer suggestions for optimal growth.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                        <option value="en">English</option>
                        <option value="hi">हिंदी</option>
                        <option value="te">తెలుగు</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {/* Farmer-friendly help card */}
                    <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                        <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                            💡 Quick Guide (सरल गाइड)
                        </h3>
                        <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                                <span className="text-2xl">🌿</span>
                                <div>
                                    <p className="font-medium">Low N? Yellow leaves?</p>
                                    <p className="text-xs text-gray-600">Use Urea or cow dung</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                                <span className="text-2xl">🌺</span>
                                <div>
                                    <p className="font-medium">Low P? Fewer flowers?</p>
                                    <p className="text-xs text-gray-600">Use DAP fertilizer</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                                <span className="text-2xl">💪</span>
                                <div>
                                    <p className="font-medium">Low K? Weak plants?</p>
                                    <p className="text-xs text-gray-600">Use MOP or wood ash</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card glass className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {result && !result.success && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                    ⚠️ {result.error || "An error occurred. Please check your inputs and try again."}
                                </div>
                            )}
                            <Input
                                name="crop"
                                placeholder="Target Crop (e.g. Rice, Maize)"
                                onChange={handleChange}
                                required
                                icon={Sprout}
                                className="bg-blue-50/30 focus-visible:ring-blue-500/30 focus-visible:border-blue-500"
                            />

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Soil Nutrients (मृदा पोषक तत्व)</h3>
                                <div className="text-xs text-gray-500 mb-2">💡 Lower values mean soil needs more nutrition</div>
                                <div className="grid grid-cols-1 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                            🌿 For Leaf Growth (पत्तियों के लिए) - N
                                        </label>
                                        <Input
                                            name="N"
                                            type="number"
                                            placeholder="Leaf nutrition value"
                                            onChange={handleChange}
                                            required
                                            icon={Activity}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                            🌺 For Flowers & Fruits (फूल और फल के लिए) - P
                                        </label>
                                        <Input
                                            name="P"
                                            type="number"
                                            placeholder="Flower nutrition value"
                                            onChange={handleChange}
                                            required
                                            icon={Activity}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                            💪 For Plant Strength (पौधों की ताकत के लिए) - K
                                        </label>
                                        <Input
                                            name="K"
                                            type="number"
                                            placeholder="Strength nutrition value"
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
                                    placeholder="pH Level"
                                    onChange={handleChange}
                                    required
                                    icon={Beaker}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full text-lg h-12 bg-blue-600 hover:bg-blue-700 shadow-blue-500/20"
                                isLoading={loading}
                            >
                                {loading ? 'Analyzing...' : 'Get Advice'}
                            </Button>
                        </form>
                    </Card>
                </div>

                <div className="space-y-6">
                    {result ? (
                        <>
                            <FertilizerCard
                                type={result.fertilizer}
                                localName={fertilizerInfo[result.fertilizer]?.localName || ''}
                                description={fertilizerInfo[result.fertilizer]?.description || result.message || "Apply this fertilizer as recommended for best results."}
                                benefits={fertilizerInfo[result.fertilizer]?.benefits || []}
                            />

                            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
                                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    📋 How to Apply (कैसे इस्तेमाल करें):
                                </h4>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">1.</span>
                                        <span>Apply fertilizer in the morning or evening</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">2.</span>
                                        <span>Mix with soil, don't put directly on plant</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">3.</span>
                                        <span>Water the plants after applying</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">4.</span>
                                        <span>Follow package instructions for quantity</span>
                                    </li>
                                </ul>
                            </Card>
                        </>
                    ) : (
                        <Card className="h-full flex flex-col justify-center items-center text-center p-8 bg-gray-50/50 border-dashed">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <Beaker size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Waiting for Input</h3>
                            <p className="text-gray-500 max-w-xs mt-2">Enter crop details and soil nutrient levels to get fertilizer recommendations.</p>
                        </Card>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default FertilizerRecommendation;
