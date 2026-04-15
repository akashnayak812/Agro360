import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { FlaskConical, Activity, Droplets, CheckCircle2, AlertTriangle, XCircle, Camera, Upload, Mic, Sprout, Wind, Sun } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { cn } from '../lib/utils';
import NutrientMeter from './NutrientMeter';
import InputModeToggle from './InputModeToggle';
import LocationSelector from './LocationSelector';
import { API_URL } from '../lib/api';
import SimpleSoilSelector from './SimpleSoilSelector';
import VoiceInput, { SpeakResult } from './VoiceInput';
import WeatherWidget from './WeatherWidget';
import { useLocationData } from '../context/LocationContext';
import LocationWidget from './LocationWidget';

import { SOIL_TYPES } from './SimpleSoilSelector';

const SoilAnalysis = () => {
    // Mode: 'simple' or 'advanced'
    const [mode, setMode] = useState('simple');
    const { i18n } = useTranslation();
    const { address, soil, isLocating } = useLocationData();

    // Simple mode state
    const [simpleData, setSimpleData] = useState({
        state: '',
        district: '',
        soilType: ''
    });

    // Advanced mode state
    const [formData, setFormData] = useState({
        N: '', P: '', K: '', ph: '', moisture: ''
    });

    // Image upload state
    const [soilImage, setSoilImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [autoFilledData, setAutoFilledData] = useState(null);

    // Hybrid soil data toggle: 'estimated' or 'manual'
    const [dataSource, setDataSource] = useState('estimated');

    // Auto-fill from global LocationContext
    useEffect(() => {
        if (address) {
            setSimpleData(prev => ({
                ...prev,
                state: address.state || prev.state,
                district: address.district || address.city || prev.district
            }));
        }
        if (soil && dataSource === 'estimated') {
            setFormData(prev => ({
                ...prev,
                N: soil.N || prev.N,
                P: soil.P || prev.P,
                K: soil.K || prev.K,
                ph: soil.ph || prev.ph
            }));
        }
    }, [address, soil, dataSource]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Handle auto-fill from location
    const handleAutoFill = (data) => {
        setAutoFilledData(data);
        setFormData({
            ...formData,
            N: data.soil?.N || '',
            P: data.soil?.P || '',
            K: data.soil?.K || '',
            ph: data.soil?.ph || '',
        });
        if (data.soil?.soil_type) {
            setSimpleData({ ...simpleData, soilType: data.soil.soil_type });
        }
    };

    // Handle voice input
    const handleVoiceResult = (voiceData) => {
        if (voiceData.mapped && ['black_sticky', 'red_sandy', 'brown_loamy', 'yellow_clay', 'alluvial'].includes(voiceData.mapped)) {
            setSimpleData({ ...simpleData, soilType: voiceData.mapped });
        }
    };

    // Handle image upload
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            setSoilImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);

            // Upload and analyze
            const formData = new FormData();
            formData.append('image', file);
            setLoading(true);

            try {
                const response = await fetch(`${API_URL}/api/soil/analyze-image`, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    // Map backend soil type to frontend ID
                    let mappedType = '';
                    const backendType = data.soil_type;

                    if (backendType === 'Red Soil') mappedType = 'red_sandy';
                    else if (backendType === 'Black Soil') mappedType = 'black_sticky';
                    else if (backendType.includes('Sandy')) mappedType = 'red_sandy'; // or yellow_clay
                    else if (backendType === 'Alluvial Soil') mappedType = 'alluvial';
                    else mappedType = 'brown_loamy'; // Fallback

                    setSimpleData(prev => ({ ...prev, soilType: mappedType }));

                    // Optional: Show a message
                    // alert(`Detected: ${backendType} (${data.confidence * 100}%)`);
                }
            } catch (error) {
                console.error("Image analysis error:", error);
                alert("Failed to analyze image");
            } finally {
                setLoading(false);
            }
        }
    };

    // Submit simple mode
    const handleSimpleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Get soil data based on soil type
            const response = await fetch(`${API_URL}/api/location/soil/by-type`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soil_type: simpleData.soilType }),
            });
            const soilData = await response.json();

            if (soilData.success) {
                // Now analyze
                const analyzeResponse = await fetch(`${API_URL}/api/soil/analyze`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        N: soilData.N,
                        P: soilData.P,
                        K: soilData.K,
                        ph: soilData.ph,
                        moisture: 50,
                        language: i18n.language
                    }),
                });
                const data = await analyzeResponse.json();
                setResult({
                    ...data,
                    detected_values: {
                        N: soilData.N,
                        P: soilData.P,
                        K: soilData.K,
                        ph: soilData.ph
                    },
                    soil_name: soilData.name,
                    recommended_crops: data.recommended_crops || soilData.recommended_crops
                });
                setFormData({
                    N: soilData.N,
                    P: soilData.P,
                    K: soilData.K,
                    ph: soilData.ph,
                    moisture: 50
                });
            }
        } catch (error) {
            console.error('Error:', error);
            setResult({ success: false, error: 'Failed to analyze. Please try again.' });
        }
        setLoading(false);
    };

    // Submit advanced mode
    const handleAdvancedSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/api/soil/analyze`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, language: i18n.language }),
            });
            const data = await response.json();
            setResult({
                ...data,
                detected_values: {
                    N: formData.N,
                    P: formData.P,
                    K: formData.K,
                    ph: formData.ph
                }
            });
        } catch (error) {
            console.error('Error:', error);
        }
        setLoading(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Good': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
            case 'Moderate': return 'text-amber-500 bg-amber-50 border-amber-200';
            default: return 'text-red-500 bg-red-50 border-red-200';
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-8 pb-12"
        >
            {/* Header Section */}
            <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-2xl text-purple-600 shadow-inner">
                        <FlaskConical size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Soil Health & Weather</h1>
                        <p className="text-gray-500">Comprehensive analysis for better yield.</p>
                    </div>
                </div>

                {address && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/60 backdrop-blur rounded-full text-sm text-gray-600 border border-white/40 shadow-sm">
                        <Sun size={16} className="text-amber-500" />
                        <span>{address.city} Weather Enabled</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Weather & Inputs */}
                <div className="lg:col-span-1 space-y-6">
                    {/* Weather Widget */}
                    <WeatherWidget location={address || { city: 'Select Location' }} />

                    {/* Mode Toggle */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <InputModeToggle mode={mode} onModeChange={setMode} />
                        <LocationWidget className="w-full sm:w-auto shrink-0 shadow-md" />
                    </div>

                    {mode === 'simple' ? (
                        /* Simple Mode */
                        <div className="space-y-4">
                            {/* Voice Input */}
                            <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Mic size={18} className="text-purple-600" />
                                    Voice Input
                                </h3>
                                <VoiceInput
                                    onResult={handleVoiceResult}
                                    placeholder="Say your soil type..."
                                />
                            </Card>

                            {/* Photo Upload Option */}
                            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Camera size={18} className="text-blue-600" />
                                    Soil Photo Analysis
                                </h3>
                                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 transition-all bg-white/50">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Soil" className="w-full h-32 object-cover rounded-lg mb-2" />
                                    ) : (
                                        <div className="text-center">
                                            <Upload size={32} className="text-blue-400 mb-2 mx-auto" />
                                            <span className="text-sm text-blue-600">Upload Photo</span>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
                            </Card>

                            {/* Location & Soil Selectors */}
                            <LocationSelector
                                selectedState={simpleData.state}
                                selectedDistrict={simpleData.district}
                                onStateChange={(state) => setSimpleData({ ...simpleData, state })}
                                onDistrictChange={(district) => setSimpleData({ ...simpleData, district })}
                                onAutoFill={handleAutoFill}
                            />
                            <SimpleSoilSelector
                                selected={simpleData.soilType}
                                onSelect={(soilType) => setSimpleData({ ...simpleData, soilType })}
                            />

                            <Button
                                onClick={handleSimpleSubmit}
                                className="w-full text-lg h-14 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30 rounded-xl"
                                isLoading={loading}
                                disabled={!simpleData.soilType}
                            >
                                {loading ? 'Analyzing...' : '🔬 Analyze Soil Health'}
                            </Button>
                        </div>
                    ) : (
                        /* Advanced Mode — Hybrid Estimated/Manual */
                        <Card glass className="p-6">
                            <form onSubmit={handleAdvancedSubmit} className="space-y-5">
                                <h3 className="font-semibold text-gray-900 border-b pb-2">Soil Data Input</h3>

                                {/* Hybrid Toggle */}
                                <div className="flex gap-2 p-1 bg-gray-100 rounded-xl">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDataSource('estimated');
                                            if (soil) {
                                                setFormData(prev => ({ ...prev, N: soil.N, P: soil.P, K: soil.K, ph: soil.ph }));
                                            }
                                        }}
                                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${dataSource === 'estimated' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
                                    >
                                        {dataSource === 'estimated' && <span>✅</span>}
                                        Use Estimated Values
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setDataSource('manual');
                                            setFormData({ N: '', P: '', K: '', ph: '', moisture: '' });
                                        }}
                                        className={`flex-1 py-2 px-3 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-1.5 ${dataSource === 'manual' ? 'bg-purple-600 text-white shadow-md' : 'text-gray-600 hover:text-gray-800'}`}
                                    >
                                        {dataSource === 'manual' && <span>✏️</span>}
                                        Enter Manual Values
                                    </button>
                                </div>

                                {/* Estimated Data Display */}
                                {dataSource === 'estimated' && (
                                    <div className="space-y-3">
                                        {isLocating ? (
                                            <div className="flex items-center justify-center py-6 text-purple-600 gap-2">
                                                <div className="w-5 h-5 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
                                                Loading location data...
                                            </div>
                                        ) : soil ? (
                                            <>
                                                <div className="flex items-center gap-2 text-xs">
                                                    <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200 font-medium">📡 {soil.source || 'Estimated'}</span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {[
                                                        { label: 'Nitrogen (N)', value: estimatedSoil.N, unit: 'mg/kg' },
                                                        { label: 'Phosphorus (P)', value: estimatedSoil.P, unit: 'mg/kg' },
                                                        { label: 'Potassium (K)', value: estimatedSoil.K, unit: 'mg/kg' },
                                                        { label: 'pH Level', value: estimatedSoil.ph, unit: '' },
                                                    ].map((item, i) => (
                                                        <div key={i} className="p-3 bg-purple-50/60 border border-purple-100 rounded-xl">
                                                            <span className="text-xs text-gray-500">{item.label}</span>
                                                            <p className="text-lg font-bold text-gray-800">{item.value} <span className="text-xs font-normal text-gray-400">{item.unit}</span></p>
                                                        </div>
                                                    ))}
                                                </div>
                                                {estimatedSoil.note && (
                                                    <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-100">ℹ️ {estimatedSoil.note}</p>
                                                )}
                                                <p className="text-xs text-gray-400 italic">⚠️ For best accuracy, use lab-tested soil values</p>
                                            </>
                                        ) : (
                                            <div className="text-center py-4 text-gray-500 text-sm">
                                                <p>Enable GPS or select a location to auto-fetch soil estimates</p>
                                                <button type="button" onClick={() => { if (location) fetchSoilEstimate(location.lat, location.lon); }} className="mt-2 text-purple-600 underline text-sm">Retry</button>
                                            </div>
                                        )}

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input name="moisture" label="Moisture %" placeholder="Optional" value={formData.moisture} onChange={handleChange} icon={Droplets} />
                                        </div>
                                    </div>
                                )}

                                {/* Manual Input Fields */}
                                {dataSource === 'manual' && (
                                    <div className="space-y-4">
                                        <Input name="N" label="Nitrogen (N)" placeholder="value in mg/kg" value={formData.N} onChange={handleChange} required icon={Activity} />
                                        <Input name="P" label="Phosphorus (P)" placeholder="value in mg/kg" value={formData.P} onChange={handleChange} required icon={Activity} />
                                        <Input name="K" label="Potassium (K)" placeholder="value in mg/kg" value={formData.K} onChange={handleChange} required icon={Activity} />

                                        <div className="grid grid-cols-2 gap-4">
                                            <Input name="ph" label="pH Level" placeholder="6-7" value={formData.ph} onChange={handleChange} required icon={FlaskConical} />
                                            <Input name="moisture" label="Moisture %" placeholder="Optional" value={formData.moisture} onChange={handleChange} icon={Droplets} />
                                        </div>
                                    </div>
                                )}

                                <Button
                                    type="submit"
                                    className="w-full text-lg h-12 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/30 rounded-xl"
                                    isLoading={loading}
                                    disabled={dataSource === 'estimated' && !estimatedSoil}
                                >
                                    {loading ? 'Analyzing...' : '🔬 Analyze Soil Health'}
                                </Button>
                            </form>
                        </Card>
                    )}
                </div>

                {/* Right Column: Results */}
                <div className="lg:col-span-2 space-y-6">
                    {result ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            {/* Status Card */}
                            <Card className="p-6 bg-white/80 border-purple-100 overflow-hidden relative">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-100/50 rounded-full blur-3xl -z-10" />

                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-xl font-bold text-gray-900">Analysis Results</h3>
                                        <p className="text-sm text-gray-500">Based on your inputs</p>
                                    </div>
                                    <div className={cn("px-4 py-2 rounded-full font-bold text-lg flex items-center gap-2 border", getStatusColor(result.status))}>
                                        {result.status} Health
                                    </div>
                                </div>

                                {/* Health Score Gauge */}
                                {result.health_score !== undefined && (
                                    <div className="flex flex-col items-center mb-8 p-6 bg-gradient-to-br from-gray-50 to-purple-50 rounded-2xl border border-purple-100/50">
                                        <div className="relative w-32 h-32">
                                            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                                                <circle cx="60" cy="60" r="54" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                                                <circle
                                                    cx="60" cy="60" r="54" fill="none"
                                                    stroke={result.health_score >= 70 ? '#10b981' : result.health_score >= 40 ? '#f59e0b' : '#ef4444'}
                                                    strokeWidth="10"
                                                    strokeLinecap="round"
                                                    strokeDasharray={`${(result.health_score / 100) * 339.3} 339.3`}
                                                />
                                            </svg>
                                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                <span className="text-3xl font-extrabold text-gray-800">{Math.round(result.health_score)}</span>
                                                <span className="text-xs text-gray-500 font-medium">/ 100</span>
                                            </div>
                                        </div>
                                        <p className="text-sm font-semibold text-gray-700 mt-3">Soil Health Score</p>

                                        {/* Component Scores */}
                                        {result.component_scores && (
                                            <div className="grid grid-cols-4 gap-3 mt-4 w-full">
                                                {[
                                                    { label: 'pH', value: result.component_scores.ph },
                                                    { label: 'NPK', value: result.component_scores.npk },
                                                    { label: 'Moisture', value: result.component_scores.moisture },
                                                    { label: 'Balance', value: result.component_scores.balance },
                                                ].map((s, i) => (
                                                    <div key={i} className="text-center p-2 bg-white/70 rounded-xl border border-gray-100">
                                                        <span className="block text-lg font-bold text-gray-800">{Math.round(s.value || 0)}</span>
                                                        <span className="text-xs text-gray-500">{s.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Deficiency Warnings */}
                                        {result.deficiencies && result.deficiencies.length > 0 && (
                                            <div className="mt-4 w-full space-y-2">
                                                {result.deficiencies.map((d, i) => (
                                                    <div key={i} className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-800">
                                                        <AlertTriangle size={14} />
                                                        {d}
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <NutrientMeter
                                        name="Nitrogen"
                                        localName="पत्ती वृद्धि (N)"
                                        value={result.detected_values.N}
                                        icon="🌿"
                                        description="Essential for leaf growth"
                                        max={300}
                                    />
                                    <NutrientMeter
                                        name="Phosphorus"
                                        localName="फूल और फल (P)"
                                        value={result.detected_values.P}
                                        icon="🌺"
                                        description="Crucial for root & flower development"
                                        max={100}
                                    />
                                    <NutrientMeter
                                        name="Potassium"
                                        localName="पौधों की ताकत (K)"
                                        value={result.detected_values.K}
                                        icon="💪"
                                        description="Improves disease resistance"
                                        max={400}
                                    />
                                </div>
                            </Card>

                            {/* Recommendations */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* AI Advice */}
                                <Card className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-100">
                                    <h4 className="font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                                        <img src="https://cdn-icons-png.flaticon.com/512/4712/4712038.png" className="w-6 h-6" alt="AI" />
                                        AI Insight
                                    </h4>
                                    <p className="text-gray-700 leading-relaxed bg-white/60 p-4 rounded-xl border border-white/50 text-sm md:text-base">
                                        {result.advice}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-3 italic">
                                        ⚠️ Predictions are AI-based estimates. For best results, consult agricultural experts.
                                    </p>
                                    <div className="mt-4 flex justify-end">
                                        <SpeakResult text={`The soil health is ${result.status}. ${result.advice}`} />
                                    </div>
                                </Card>

                                {/* Recommended Crops */}
                                <Card className="p-6 bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-100">
                                    <h4 className="font-semibold text-emerald-900 mb-4 flex items-center gap-2">
                                        <Sprout size={20} />
                                        Recommended Crops
                                    </h4>

                                    {result.recommended_crops && result.recommended_crops.length > 0 ? (
                                        <div className="flex flex-col gap-3">
                                            {result.recommended_crops.map((crop, idx) => (
                                                <div key={idx} className="bg-white/70 p-3 rounded-xl border border-white/50 flex items-center justify-between group hover:bg-white transition-colors">
                                                    <span className="font-medium text-gray-800">{crop}</span>
                                                    <Button size="sm" variant="ghost" className="text-emerald-600 bg-emerald-100/50 hover:bg-emerald-100 h-8 text-xs">
                                                        Details
                                                    </Button>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500 italic">No specific crop recommendations.</p>
                                    )}
                                </Card>
                            </div>
                        </motion.div>
                    ) : (
                        /* Empty State */
                        <Card className="h-full flex flex-col justify-center items-center text-center p-12 bg-white/50 border-dashed border-2 border-gray-200">
                            <div className="w-24 h-24 bg-purple-50 rounded-full flex items-center justify-center text-purple-300 mb-6">
                                <FlaskConical size={48} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">Ready to Analyze</h3>
                            <p className="text-gray-500 max-w-sm mt-2 mx-auto">
                                Select a mode on the left and input your soil details to get a comprehensive health report and AI-driven recommendations.
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SoilAnalysis;
