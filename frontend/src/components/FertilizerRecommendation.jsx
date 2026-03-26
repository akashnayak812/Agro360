import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Droplets, Sprout, Activity, Beaker, Mic } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import FertilizerCard from './FertilizerCard';
import InputModeToggle from './InputModeToggle';
import LocationSelector from './LocationSelector';
import SimpleSoilSelector from './SimpleSoilSelector';
import { API_URL } from '../lib/api';
import VoiceInput, { SpeakResult } from './VoiceInput';

// Common crops list for easy selection
const COMMON_CROPS = [
    { id: 'rice', name: 'Rice', emoji: '🌾', localName: 'चावल / వరి' },
    { id: 'wheat', name: 'Wheat', emoji: '🌾', localName: 'गेहूं / గోధుమ' },
    { id: 'cotton', name: 'Cotton', emoji: '🌿', localName: 'कपास / పత్తి' },
    { id: 'maize', name: 'Maize', emoji: '🌽', localName: 'मक्का / మొక్కజొన్న' },
    { id: 'sugarcane', name: 'Sugarcane', emoji: '🎋', localName: 'गन्ना / చెరుకు' },
    { id: 'groundnut', name: 'Groundnut', emoji: '🥜', localName: 'मूंगफली / వేరుశెనగ' },
    { id: 'soybean', name: 'Soybean', emoji: '🫘', localName: 'सोयाबीन / సోయాబీన్' },
    { id: 'tomato', name: 'Tomato', emoji: '🍅', localName: 'टमाटर / టమాటా' },
    { id: 'potato', name: 'Potato', emoji: '🥔', localName: 'आलू / బంగాళాదుంప' },
    { id: 'onion', name: 'Onion', emoji: '🧅', localName: 'प्याज / ఉల్లిపాయ' },
    { id: 'chilli', name: 'Chilli', emoji: '🌶️', localName: 'मिर्च / మిర్చి' },
    { id: 'banana', name: 'Banana', emoji: '🍌', localName: 'केला / అరటి' },
];

const FertilizerRecommendation = () => {
    // Mode: 'simple' or 'advanced'
    const [mode, setMode] = useState('simple');
    const { i18n } = useTranslation();
    
    // Simple mode state
    const [simpleData, setSimpleData] = useState({
        state: '',
        district: '',
        soilType: '',
        selectedCrop: ''
    });
    
    // Advanced mode state
    const [formData, setFormData] = useState({
        N: '', P: '', K: '', ph: '', crop: ''
    });
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [autoFilledData, setAutoFilledData] = useState(null);

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

    // Handle voice input for crop
    const handleVoiceResult = (voiceData) => {
        // Check if it's a crop name
        const cropMatch = COMMON_CROPS.find(c => 
            c.name.toLowerCase() === voiceData.raw.toLowerCase() ||
            c.name.toLowerCase() === voiceData.mapped?.toLowerCase()
        );
        if (cropMatch) {
            setSimpleData({ ...simpleData, selectedCrop: cropMatch.name });
            setFormData({ ...formData, crop: cropMatch.name });
        } else if (voiceData.mapped && ['black_sticky', 'red_sandy', 'brown_loamy', 'yellow_clay', 'alluvial'].includes(voiceData.mapped)) {
            setSimpleData({ ...simpleData, soilType: voiceData.mapped });
        }
    };

    // Submit simple mode
    const handleSimpleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            // Get soil data based on soil type
            const soilResponse = await fetch(`${API_URL}/api/location/soil/by-type`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ soil_type: simpleData.soilType }),
            });
            const soilData = await soilResponse.json();
            
            if (soilData.success) {
                // Get fertilizer recommendation
                const response = await fetch(`${API_URL}/api/fertilizer/recommend`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        N: soilData.N,
                        P: soilData.P,
                        K: soilData.K,
                        ph: soilData.ph,
                        crop: simpleData.selectedCrop,
                        language: i18n.language
                    }),
                });
                const data = await response.json();
                setResult({
                    ...data,
                    detected_values: {
                        N: soilData.N,
                        P: soilData.P,
                        K: soilData.K,
                        ph: soilData.ph
                    }
                });
            }
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
            const response = await fetch(`${API_URL}/api/fertilizer/recommend`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...formData, language: i18n.language }),
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
                        <p className="text-sm text-blue-600">उर्वरक सलाह / ఎరువుల సలహా</p>
                    </div>
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
                            <Card className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    <Mic size={18} className="text-blue-600" />
                                    Voice Input (आवाज से बताएं)
                                </h3>
                                <VoiceInput 
                                    onResult={handleVoiceResult}
                                    placeholder="Say crop name or soil type..."
                                />
                            </Card>

                            {/* Quick Guide */}
                            <Card className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
                                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                    💡 Quick Guide (सरल गाइड)
                                </h3>
                                <div className="space-y-3 text-sm text-gray-700">
                                    <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                                        <span className="text-2xl">🌿</span>
                                        <div>
                                            <p className="font-medium">Yellow leaves?</p>
                                            <p className="text-xs text-gray-600">Use Urea or cow dung (यूरिया या गोबर)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                                        <span className="text-2xl">🌺</span>
                                        <div>
                                            <p className="font-medium">Fewer flowers?</p>
                                            <p className="text-xs text-gray-600">Use DAP fertilizer (डीएपी)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 p-2 bg-white/60 rounded-lg">
                                        <span className="text-2xl">💪</span>
                                        <div>
                                            <p className="font-medium">Weak plants?</p>
                                            <p className="text-xs text-gray-600">Use MOP or wood ash (पोटाश या राख)</p>
                                        </div>
                                    </div>
                                </div>
                            </Card>

                            {/* Location Selector */}
                            <LocationSelector
                                selectedState={simpleData.state}
                                selectedDistrict={simpleData.district}
                                onStateChange={(state) => setSimpleData({ ...simpleData, state })}
                                onDistrictChange={(district) => setSimpleData({ ...simpleData, district })}
                                onAutoFill={handleAutoFill}
                            />

                            {/* Crop Selection */}
                            <div className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">🌱</span>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">What crop are you growing?</h3>
                                        <p className="text-sm text-gray-500">आप कौन सी फसल उगा रहे हैं? / మీరు ఏ పంట పండిస్తున్నారు?</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                    {COMMON_CROPS.map((crop) => (
                                        <motion.button
                                            key={crop.id}
                                            type="button"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => {
                                                setSimpleData({ ...simpleData, selectedCrop: crop.name });
                                                setFormData({ ...formData, crop: crop.name });
                                            }}
                                            className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                                                simpleData.selectedCrop === crop.name
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <span className="text-2xl">{crop.emoji}</span>
                                            <span className="text-xs font-medium">{crop.name}</span>
                                        </motion.button>
                                    ))}
                                </div>
                            </div>

                            {/* Soil Type Selector */}
                            <SimpleSoilSelector
                                selected={simpleData.soilType}
                                onSelect={(soilType) => setSimpleData({ ...simpleData, soilType })}
                                showDetails={false}
                            />

                            <form onSubmit={handleSimpleSubmit}>
                                <Button
                                    type="submit"
                                    className="w-full text-lg h-14 bg-blue-600 hover:bg-blue-700"
                                    isLoading={loading}
                                    disabled={!simpleData.selectedCrop || !simpleData.soilType}
                                >
                                    {loading ? 'Getting Advice...' : '💧 Get Fertilizer Advice'}
                                </Button>
                                <p className="text-xs text-center text-gray-500 mt-2">
                                    उर्वरक सलाह पाएं / ఎరువుల సలహా పొందండి
                                </p>
                            </form>
                        </>
                    ) : (
                        /* Advanced Mode */
                        <>
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

                            <Card glass className="p-8">
                                <form onSubmit={handleAdvancedSubmit} className="space-y-6">
                                    {result && !result.success && (
                                        <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100">
                                            ⚠️ {result.error || "An error occurred. Please check your inputs and try again."}
                                        </div>
                                    )}
                                    <Input
                                        name="crop"
                                        placeholder="Target Crop (e.g. Rice, Maize)"
                                        value={formData.crop}
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
                                                    value={formData.N}
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
                                                    value={formData.P}
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
                                            placeholder="pH Level"
                                            value={formData.ph}
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
                        </>
                    )}
                </div>

                <div className="space-y-6">
                    {result && result.success ? (
                        <>
                            <FertilizerCard
                                type={result.fertilizer}
                                localName={fertilizerInfo[result.fertilizer]?.localName || ''}
                                description={fertilizerInfo[result.fertilizer]?.description || result.message || "Apply this fertilizer as recommended for best results."}
                                benefits={fertilizerInfo[result.fertilizer]?.benefits || []}
                            />

                            {/* Show detected values */}
                            {result.detected_values && (
                                <Card className="p-4 bg-blue-50 border-blue-200">
                                    <p className="text-sm font-medium text-blue-700 mb-2">📊 Your soil values:</p>
                                    <div className="grid grid-cols-4 gap-2 text-xs">
                                        <div className="p-2 bg-white rounded-lg text-center">
                                            <p className="text-gray-500">N</p>
                                            <p className="font-semibold">{result.detected_values.N}</p>
                                        </div>
                                        <div className="p-2 bg-white rounded-lg text-center">
                                            <p className="text-gray-500">P</p>
                                            <p className="font-semibold">{result.detected_values.P}</p>
                                        </div>
                                        <div className="p-2 bg-white rounded-lg text-center">
                                            <p className="text-gray-500">K</p>
                                            <p className="font-semibold">{result.detected_values.K}</p>
                                        </div>
                                        <div className="p-2 bg-white rounded-lg text-center">
                                            <p className="text-gray-500">pH</p>
                                            <p className="font-semibold">{result.detected_values.ph}</p>
                                        </div>
                                    </div>
                                </Card>
                            )}

                            <Card className="p-6 bg-gradient-to-br from-blue-50 to-white border-blue-100">
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                                        📋 How to Apply (कैसे इस्तेमाल करें):
                                    </h4>
                                    <SpeakResult text={`Use ${result.fertilizer} fertilizer. Apply in morning or evening. Mix with soil. Water the plants after applying.`} />
                                </div>
                                <ul className="space-y-2 text-sm text-gray-700">
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">1.</span>
                                        <span>Apply fertilizer in the morning or evening (सुबह या शाम)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">2.</span>
                                        <span>Mix with soil, don't put directly on plant (मिट्टी में मिलाएं)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">3.</span>
                                        <span>Water the plants after applying (पानी दें)</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-blue-500 font-bold">4.</span>
                                        <span>Follow package instructions for quantity (मात्रा के लिए पैकेट देखें)</span>
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
                            <p className="text-gray-500 max-w-xs mt-2">
                                {mode === 'simple'
                                    ? "Select your crop and soil type to get fertilizer recommendations."
                                    : "Enter crop details and soil nutrient levels to get fertilizer recommendations."
                                }
                            </p>
                            <p className="text-sm text-blue-600 mt-2">
                                इनपुट की प्रतीक्षा / ఇన్‌పుట్ కోసం వేచి ఉంది
                            </p>
                        </Card>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default FertilizerRecommendation;
