import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sprout, Leaf, Activity, Droplets, Thermometer, Wind, CloudRain, Mic, Volume2 } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import InputModeToggle from './InputModeToggle';
import LocationSelector from './LocationSelector';
import SimpleSoilSelector from './SimpleSoilSelector';
import WaterAvailabilitySelector from './WaterAvailabilitySelector';
import VoiceInput, { SpeakResult } from './VoiceInput';

const CropRecommendation = () => {
    // Mode: 'simple' or 'advanced'
    const [mode, setMode] = useState('simple');
    
    // Simple mode state
    const [simpleData, setSimpleData] = useState({
        state: '',
        district: '',
        soilType: '',
        water: 'normal'
    });
    
    // Advanced mode state (original form)
    const [formData, setFormData] = useState({
        N: '', P: '', K: '', temperature: '', humidity: '', ph: '', rainfall: ''
    });
    
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [autoFilledData, setAutoFilledData] = useState(null);

    // Handle advanced mode input change
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle auto-fill from location
    const handleAutoFill = (data) => {
        setAutoFilledData(data);
        // Also update form data for advanced mode
        setFormData({
            ...formData,
            N: data.soil?.N || '',
            P: data.soil?.P || '',
            K: data.soil?.K || '',
            ph: data.soil?.ph || '',
            temperature: data.weather?.temperature || '',
            humidity: data.weather?.humidity || '',
            rainfall: data.weather?.rainfall || ''
        });
    };

    // Handle voice input
    const handleVoiceResult = (voiceData) => {
        if (voiceData.mapped) {
            // Check what type of input it is
            if (['black_sticky', 'red_sandy', 'brown_loamy', 'yellow_clay', 'alluvial'].includes(voiceData.mapped)) {
                setSimpleData({ ...simpleData, soilType: voiceData.mapped });
            } else if (['very_less', 'less', 'normal', 'good', 'heavy'].includes(voiceData.mapped)) {
                setSimpleData({ ...simpleData, water: voiceData.mapped });
            }
        }
    };

    // Submit simple mode
    const handleSimpleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch('http://localhost:5001/api/crop/recommend-simple', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    state: simpleData.state,
                    district: simpleData.district,
                    soil_type: simpleData.soilType,
                    water: simpleData.water
                }),
            });
            const data = await response.json();
            setResult(data);
        } catch (error) {
            console.error('Error:', error);
            setResult({ success: false, error: 'Failed to get recommendation. Please try again.' });
        }
        setLoading(false);
    };

    // Submit advanced mode
    const handleAdvancedSubmit = async (e) => {
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
            setResult({ success: false, error: 'Failed to get recommendation. Please try again.' });
        }
        setLoading(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8"
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-emerald-100 rounded-2xl text-emerald-600">
                        <Sprout size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Crop Recommendation</h1>
                        <p className="text-gray-500">AI-powered suggestions for the best crop for your field.</p>
                        <p className="text-sm text-emerald-600">फसल सुझाव / పంట సిఫార్సు</p>
                    </div>
                </div>
            </div>

            {/* Mode Toggle */}
            <InputModeToggle mode={mode} onModeChange={setMode} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card glass className="p-8">
                    {mode === 'simple' ? (
                        /* Simple Mode Form */
                        <form onSubmit={handleSimpleSubmit} className="space-y-6">
                            {result && !result.success && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                    ⚠️ {result.error || "An error occurred. Please try again."}
                                </div>
                            )}

                            {/* Voice Input */}
                            <Card className="p-4 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Mic size={18} className="text-emerald-600" />
                                    Voice Input (आवाज से बताएं)
                                </h3>
                                <VoiceInput 
                                    onResult={handleVoiceResult}
                                    placeholder="Say soil type or water level..."
                                />
                            </Card>

                            {/* Location Selector */}
                            <LocationSelector
                                selectedState={simpleData.state}
                                selectedDistrict={simpleData.district}
                                onStateChange={(state) => setSimpleData({ ...simpleData, state })}
                                onDistrictChange={(district) => setSimpleData({ ...simpleData, district })}
                                onAutoFill={handleAutoFill}
                            />

                            {/* Soil Type Selector */}
                            <SimpleSoilSelector
                                selected={simpleData.soilType}
                                onSelect={(soilType) => setSimpleData({ ...simpleData, soilType })}
                            />

                            {/* Water Availability */}
                            <WaterAvailabilitySelector
                                selected={simpleData.water}
                                onSelect={(water) => setSimpleData({ ...simpleData, water })}
                            />

                            <Button
                                type="submit"
                                className="w-full text-lg h-14"
                                isLoading={loading}
                                disabled={!simpleData.state || !simpleData.district}
                            >
                                {loading ? 'Finding Best Crop...' : '🌱 Get Crop Recommendation'}
                            </Button>
                            
                            <p className="text-xs text-center text-gray-500">
                                फसल का सुझाव पाएं / పంట సిఫార్సు పొందండి
                            </p>
                        </form>
                    ) : (
                        /* Advanced Mode Form */
                        <form onSubmit={handleAdvancedSubmit} className="space-y-6">
                            {result && !result.success && (
                                <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                    ⚠️ {result.error || "An error occurred. Please check your inputs and try again."}
                                </div>
                            )}
                            
                            {/* Auto-fill option */}
                            <Card className="p-4 bg-blue-50 border-blue-200">
                                <p className="text-sm text-blue-700 mb-2">💡 Don't know the values?</p>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMode('simple')}
                                    className="text-blue-600 border-blue-300"
                                >
                                    Switch to Simple Mode
                                </Button>
                            </Card>

                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Soil Nutrients</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <div>
                                        <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                            🌿 Nitrogen (N) - Leaf Growth
                                        </label>
                                        <Input
                                            name="N"
                                            type="number"
                                            placeholder="Enter N value (0-140)"
                                            value={formData.N}
                                            onChange={handleChange}
                                            required
                                            icon={Activity}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                            🌺 Phosphorus (P) - Flowers & Fruits
                                        </label>
                                        <Input
                                            name="P"
                                            type="number"
                                            placeholder="Enter P value (0-145)"
                                            value={formData.P}
                                            onChange={handleChange}
                                            required
                                            icon={Activity}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                                            💪 Potassium (K) - Plant Strength
                                        </label>
                                        <Input
                                            name="K"
                                            type="number"
                                            placeholder="Enter K value (0-205)"
                                            value={formData.K}
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
                                    value={formData.ph}
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
                                        value={formData.temperature}
                                        onChange={handleChange}
                                        icon={Thermometer}
                                    />
                                    <Input
                                        name="humidity"
                                        type="number"
                                        step="0.1"
                                        placeholder="Humidity (%)"
                                        value={formData.humidity}
                                        onChange={handleChange}
                                        icon={Wind}
                                    />
                                    <Input
                                        name="rainfall"
                                        type="number"
                                        step="0.1"
                                        placeholder="Rainfall (mm)"
                                        value={formData.rainfall}
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
                    )}
                </Card>

                {/* Results Section */}
                <div className="space-y-6">
                    {result && result.success ? (
                        <Card className="p-8 bg-gradient-to-br from-emerald-50 to-white border-emerald-100 h-full flex flex-col justify-center items-center text-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-6"
                            >
                                <Leaf size={48} />
                            </motion.div>
                            
                            <div className="flex items-center gap-2 mb-2">
                                <h3 className="text-sm font-semibold text-emerald-600 uppercase tracking-wider">Best Crop to Grow</h3>
                                <SpeakResult text={`The best crop for your field is ${result.crop}`} />
                            </div>
                            
                            <h2 className="text-5xl font-bold text-gray-900 mb-4 capitalize">{result.crop}</h2>
                            
                            <p className="text-gray-600 max-w-sm mb-4">{result.message}</p>
                            
                            {/* Show detected values in simple mode */}
                            {result.detected_values && (
                                <div className="w-full mt-4 p-4 bg-white/60 rounded-xl border border-emerald-100">
                                    <p className="text-sm font-medium text-gray-700 mb-2">📊 Auto-detected values:</p>
                                    <div className="grid grid-cols-4 gap-2 text-xs">
                                        <div className="p-2 bg-emerald-50 rounded-lg">
                                            <p className="text-gray-500">N</p>
                                            <p className="font-semibold">{result.detected_values.N}</p>
                                        </div>
                                        <div className="p-2 bg-emerald-50 rounded-lg">
                                            <p className="text-gray-500">P</p>
                                            <p className="font-semibold">{result.detected_values.P}</p>
                                        </div>
                                        <div className="p-2 bg-emerald-50 rounded-lg">
                                            <p className="text-gray-500">K</p>
                                            <p className="font-semibold">{result.detected_values.K}</p>
                                        </div>
                                        <div className="p-2 bg-emerald-50 rounded-lg">
                                            <p className="text-gray-500">pH</p>
                                            <p className="font-semibold">{result.detected_values.ph}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white/60 backdrop-blur-sm px-6 py-3 rounded-full border border-emerald-200 text-emerald-700 font-medium mt-4">
                                AI Confidence: <span className="font-bold">{(result.confidence * 100).toFixed(1)}%</span>
                            </div>
                        </Card>
                    ) : (
                        <Card className="h-full flex flex-col justify-center items-center text-center p-8 bg-gray-50/50 border-dashed">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <Sprout size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">No Analysis Yet</h3>
                            <p className="text-gray-500 max-w-xs mt-2">
                                {mode === 'simple' 
                                    ? "Select your location and soil type to get crop recommendations."
                                    : "Fill out the form with your soil data to get accurate crop recommendations."
                                }
                            </p>
                            <p className="text-sm text-emerald-600 mt-2">
                                अभी तक कोई सुझाव नहीं / ఇంకా సిఫార్సు లేదు
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default CropRecommendation;
