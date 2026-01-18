import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Sprout, Map, CloudRain, Briefcase } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const YieldPrediction = () => {
    const [formData, setFormData] = useState({
        crop: '', area: '', rainfall: '', fertilizer: ''
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
            const response = await fetch('http://localhost:5001/api/yield/predict', {
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
            <div className="flex items-center gap-4">
                <div className="p-3 bg-amber-100 rounded-2xl text-amber-600">
                    <TrendingUp size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Yield Prediction</h1>
                    <p className="text-gray-500">Estimate your harvest quantity based on field parameters.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card glass className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            name="crop"
                            placeholder="Crop Type (e.g. Wheat)"
                            onChange={handleChange}
                            required
                            icon={Sprout}
                        />
                        <Input
                            name="area"
                            placeholder="Field Area (Hectares)"
                            onChange={handleChange}
                            required
                            icon={Map}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                name="rainfall"
                                placeholder="Rainfall (mm)"
                                onChange={handleChange}
                                icon={CloudRain}
                            />
                            <Input
                                name="fertilizer"
                                placeholder="Fertilizer (kg)"
                                onChange={handleChange}
                                icon={Briefcase}
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full text-lg h-12 bg-amber-500 hover:bg-amber-600 shadow-amber-500/20"
                            isLoading={loading}
                        >
                            {loading ? 'Calculating...' : 'Predict Yield'}
                        </Button>
                    </form>
                </Card>

                <div className="space-y-6">
                    {result ? (
                        <Card className="p-8 bg-gradient-to-br from-amber-50 to-white border-amber-100 h-full flex flex-col justify-center items-center text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-6"
                            >
                                <TrendingUp size={48} />
                            </motion.div>
                            <h3 className="text-sm font-semibold text-amber-600 uppercase tracking-wider mb-2">Estimated Production</h3>
                            <h2 className="text-5xl font-bold text-gray-900 mb-2">
                                {result.predicted_yield} <span className="text-2xl text-gray-400 font-medium">{result.unit || 'Tonnes'}</span>
                            </h2>
                            <p className="text-gray-500 max-w-sm mt-4">{result.message || "This calculation is based on average yield data for similar conditions."}</p>
                        </Card>
                    ) : (
                        <Card className="h-full flex flex-col justify-center items-center text-center p-8 bg-gray-50/50 border-dashed">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <TrendingUp size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">No Estimate Generated</h3>
                            <p className="text-gray-500 max-w-xs mt-2">Fill in the crop and field details to calculate potential yield.</p>
                        </Card>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default YieldPrediction;
