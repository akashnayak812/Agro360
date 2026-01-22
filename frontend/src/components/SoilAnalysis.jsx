import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Activity, Droplets, CheckCircle2, AlertTriangle, XCircle, Camera, Upload, Mic } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { cn } from '../lib/utils';
import NutrientMeter from './NutrientMeter';
import InputModeToggle from './InputModeToggle';
import LocationSelector from './LocationSelector';
import SimpleSoilSelector from './SimpleSoilSelector';
import VoiceInput, { SpeakResult } from './VoiceInput';

const SoilAnalysis = () => {
    // Mode: 'simple' or 'advanced'
    const [mode, setMode] = useState('simple');
    
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
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSoilImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    // Submit simple mode
    const handleSimpleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Get soil data based on soil type
            const response = await fetch('http://localhost:5001/api/location/soil/by-type', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soil_type: simpleData.soilType }),
            });
            const soilData = await response.json();
            
            if (soilData.success) {
                // Now analyze
                const analyzeResponse = await fetch('http://localhost:5001/api/soil/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        N: soilData.N,
                        P: soilData.P,
                        K: soilData.K,
                        ph: soilData.ph,
                        moisture: 50
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
                    recommended_crops: soilData.recommended_crops
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
            const response = await fetch('http://localhost:5001/api/soil/analyze', {
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

    const getStatusColor = (status) => {
        switch (status) {
            case 'Good': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
            case 'Moderate': return 'text-amber-500 bg-amber-50 border-amber-200';
            default: return 'text-red-500 bg-red-50 border-red-200';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Good': return CheckCircle2;
            case 'Moderate': return AlertTriangle;
            default: return XCircle;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 rounded-2xl text-purple-600">
                    <FlaskConical size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Soil Health Analysis</h1>
                    <p className="text-gray-500">Comprehensive analysis of your soil's nutrient profile.</p>
                    <p className="text-sm text-purple-600">मिट्टी स्वास्थ्य जांच / మట్టి ఆరోగ్య విశ్లేషణ</p>
                </div>
            </div>

            {/* Mode Toggle */}
            <InputModeToggle mode={mode} onModeChange={setMode} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                    {mode === 'simple' ? (
                        /* Simple Mode */
                        <>
                            {/* Voice Input */}
                            <Card className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Mic size={18} className="text-purple-600" />
                                    Voice Input (आवाज से बताएं)
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
                                    Upload Soil Photo (मिट्टी की फोटो)
                                </h3>
                                <p className="text-sm text-gray-500 mb-3">
                                    Take a photo of your soil to help identify the type
                                </p>
                                <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer hover:bg-blue-50 transition-all">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Soil" className="w-32 h-32 object-cover rounded-lg mb-2" />
                                    ) : (
                                        <Upload size={32} className="text-blue-400 mb-2" />
                                    )}
                                    <span className="text-sm text-blue-600">
                                        {imagePreview ? 'Change Photo' : 'Click to upload photo'}
                                    </span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        onChange={handleImageUpload}
                                        className="hidden"
                                    />
                                </label>
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

                            <form onSubmit={handleSimpleSubmit}>
                                <Button
                                    type="submit"
                                    className="w-full text-lg h-14 bg-purple-600 hover:bg-purple-700"
                                    isLoading={loading}
                                    disabled={!simpleData.soilType}
                                >
                                    {loading ? 'Analyzing...' : '🔬 Analyze Soil Health'}
                                </Button>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    मिट्टी की जांच करें / మట్టిని పరీక్షించండి
                                </p>
                            </form>
                        </>
                    ) : (
                        /* Advanced Mode - Original Form */
                        <>
                            {/* Farmer-friendly help card */}
                            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    💡 How to Get Your Soil Tested (मिट्टी की जांच कैसे करें)
                                </h3>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 font-bold">1.</span>
                                        <span>Visit your nearest agriculture office (कृषि कार्यालय)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 font-bold">2.</span>
                                        <span>Give them a soil sample from your field</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 font-bold">3.</span>
                                        <span>Get a report with N, P, K values</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-purple-500 font-bold">4.</span>
                                        <span>Enter those values here for advice</span>
                                    </li>
                                </ul>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setMode('simple')}
                                    className="mt-4 text-purple-600 border-purple-300"
                                >
                                    Don't have values? Use Simple Mode
                                </Button>
                            </Card>

                            <Card glass className="p-8">
                                <form onSubmit={handleAdvancedSubmit} className="space-y-6">
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Soil Nutrients (मृदा पोषक तत्व)</h3>
                                        <div className="text-xs text-gray-500 mb-2">💡 Enter values from your soil test report</div>
                                        <div className="grid grid-cols-1 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                                    🌿 Leaf Growth (पत्ती वृद्धि) - N
                                                </label>
                                                <Input
                                                    name="N"
                                                    placeholder="Makes plants green and leafy (पौधों को हरा बनाता है)"
                                                    value={formData.N}
                                                    onChange={handleChange}
                                                    required
                                                    icon={Activity}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                                    🌺 Flowering & Fruiting (फूल और फल) - P
                                                </label>
                                                <Input
                                                    name="P"
                                                    placeholder="Helps flowers bloom and fruits grow (फूल और फल बढ़ाता है)"
                                                    value={formData.P}
                                                    onChange={handleChange}
                                                    required
                                                    icon={Activity}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                                    💪 Plant Strength (पौधों की ताकत) - K
                                                </label>
                                                <Input
                                                    name="K"
                                                    placeholder="Makes plants strong and disease-resistant (रोग प्रतिरोधक)"
                                                    value={formData.K}
                                                    onChange={handleChange}
                                                    required
                                                    icon={Activity}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4 mt-4">
                                            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Other Factors (अन्य कारक)</h3>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                                    ⚗️ Soil Acidity (मिट्टी की अम्लता) - pH
                                                    <span className="text-xs text-gray-500">(Normal: 6-7)</span>
                                                </label>
                                                <Input
                                                    name="ph"
                                                    placeholder="pH Level (6-7 is good for most crops)"
                                                    value={formData.ph}
                                                    onChange={handleChange}
                                                    required
                                                    icon={FlaskConical}
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-gray-700 flex items-center gap-2 mb-1">
                                                    💧 Soil Moisture (मिट्टी की नमी) - Optional
                                                </label>
                                                <Input
                                                    name="moisture"
                                                    placeholder="Moisture % (Optional)"
                                                    value={formData.moisture}
                                                    onChange={handleChange}
                                                    icon={Droplets}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full text-lg h-12 bg-purple-600 hover:bg-purple-700 shadow-purple-500/20"
                                        isLoading={loading}
                                    >
                                        {loading ? 'Analyzing Profile...' : 'Analyze Health'}
                                    </Button>
                                </form>
                            </Card>
                        </>
                    )}
                </div>

                <div className="space-y-6">
                    {result ? (
                        <>
                            <Card className="p-8 bg-white/80 border-purple-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                        <Activity size={20} className="text-purple-500" />
                                        Soil Nutrients Analysis (मृदा पोषक विश्लेषण)
                                    </h3>
                                    <SpeakResult text={`Your soil health is ${result.status}. ${result.advice}`} />
                                </div>

                                {/* Show detected soil type in simple mode */}
                                {result.soil_name && (
                                    <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                                        <p className="text-sm text-purple-700">
                                            <span className="font-medium">Detected Soil:</span> {result.soil_name}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <NutrientMeter
                                        name="Leaf Growth"
                                        localName="पत्ती वृद्धि (N)"
                                        value={formData.N}
                                        icon="🌿"
                                        description="Makes plants green and leafy"
                                    />
                                    <NutrientMeter
                                        name="Flowering & Fruiting"
                                        localName="फूल और फल (P)"
                                        value={formData.P}
                                        icon="🌺"
                                        description="Helps flowers bloom and fruits grow"
                                    />
                                    <NutrientMeter
                                        name="Plant Strength"
                                        localName="पौधों की ताकत (K)"
                                        value={formData.K}
                                        icon="💪"
                                        description="Makes plants strong and disease-resistant"
                                    />
                                </div>
                            </Card>

                            <Card className="p-8 bg-white/80 border-purple-100">
                                <div className={cn("flex items-center gap-4 p-6 rounded-2xl border mb-6", getStatusColor(result.status))}>
                                    {React.createElement(getStatusIcon(result.status), { size: 40 })}
                                    <div>
                                        <h4 className="text-sm font-semibold uppercase tracking-wider opacity-80">Overall Soil Health</h4>
                                        <p className="text-3xl font-bold">{result.status}</p>
                                    </div>
                                </div>

                                {/* Recommended crops from simple mode */}
                                {result.recommended_crops && result.recommended_crops.length > 0 && (
                                    <div className="mb-4 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                        <h4 className="font-medium text-emerald-700 mb-2 flex items-center gap-2">
                                            🌾 Best Crops for Your Soil:
                                        </h4>
                                        <div className="flex flex-wrap gap-2">
                                            {result.recommended_crops.map(crop => (
                                                <span
                                                    key={crop}
                                                    className="px-3 py-1 bg-white rounded-full text-sm text-emerald-700 border border-emerald-200"
                                                >
                                                    {crop}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <h4 className="font-medium text-gray-900 flex items-center gap-2">
                                        💡 What to do (क्या करें):
                                    </h4>
                                    <div className="p-4 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl text-gray-700 leading-relaxed border border-purple-100">
                                        {result.advice}
                                    </div>
                                </div>
                            </Card>
                        </>
                    ) : (
                        <Card className="h-full flex flex-col justify-center items-center text-center p-8 bg-gray-50/50 border-dashed">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
                                <FlaskConical size={32} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900">Awaiting Data</h3>
                            <p className="text-gray-500 max-w-xs mt-2">
                                {mode === 'simple' 
                                    ? "Select your soil type to generate a health report."
                                    : "Input your soil test results to generate a health report."
                                }
                            </p>
                            <p className="text-sm text-purple-600 mt-2">
                                डेटा की प्रतीक्षा / డేటా కోసం వేచి ఉంది
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default SoilAnalysis;
