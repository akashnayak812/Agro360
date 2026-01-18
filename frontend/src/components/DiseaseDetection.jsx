import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Upload, Camera, X, Check, AlertOctagon, Activity } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const DiseaseDetection = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const clearImage = (e) => {
        e.stopPropagation();
        setImage(null);
        setPreview(null);
        setResult(null);
    };

    const handleSubmit = async () => {
        if (!image) return;
        setLoading(true);

        try {
            // Mock API call structure
            const response = await fetch('http://localhost:5001/api/disease/detect', {
                method: 'POST',
                // body: formData
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
                <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                    <ScanLine size={32} />
                </div>
                <div>
                    <h1 className="text-3xl font-heading font-bold text-gray-900">Plant Doctor</h1>
                    <p className="text-gray-500">Instant disease diagnosis from leaf photos.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card glass className="p-8 flex flex-col items-center">
                    <div className="w-full relative group cursor-pointer">
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        <div
                            onClick={() => document.getElementById('fileInput').click()}
                            className={`
                                relative w-full h-80 rounded-3xl border-3 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                                ${preview ? 'border-red-400/50 bg-gray-900' : 'border-gray-300 hover:border-red-400 hover:bg-red-50/30'}
                            `}
                        >
                            {preview ? (
                                <>
                                    <img src={preview} alt="Preview" className="w-full h-full object-cover opacity-80" />
                                    <button
                                        onClick={clearImage}
                                        className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </>
                            ) : (
                                <div className="text-center p-6">
                                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-500 mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <Camera size={32} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Upload Leaf Image</h3>
                                    <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">Click to browse or drag and drop a clear photo of the affected leaf.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    <Button
                        onClick={handleSubmit}
                        disabled={!image || loading}
                        variant="danger"
                        className="w-full h-14 text-lg mt-6 bg-red-600 hover:bg-red-700 shadow-red-500/20"
                        isLoading={loading}
                    >
                        {loading ? 'Scanning Leaf...' : 'Diagnose Disease'}
                    </Button>
                </Card>

                <div className="space-y-6">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <Card key="result" className="p-8 bg-white border-red-100 h-full flex flex-col shadow-xl shadow-red-500/5">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 text-red-600 font-semibold mb-6 pb-4 border-b border-red-100"
                                >
                                    <AlertOctagon size={24} />
                                    Diagnosis Report
                                </motion.div>

                                <div className="mb-8">
                                    <h4 className="text-sm font-semibold uppercase tracking-wider text-gray-400 mb-1">Detected Issue</h4>
                                    <h2 className="text-4xl font-bold text-gray-900 leading-tight">{result.disease}</h2>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                            <Activity size={18} className="text-gray-400" />
                                            Symptoms
                                        </h4>
                                        <p className="text-gray-600 leading-relaxed bg-gray-50 p-4 rounded-xl">{result.symptoms}</p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-2">
                                            <Check size={18} className="text-green-500" />
                                            Recommended Treatment
                                        </h4>
                                        <div className="p-5 bg-red-50 rounded-2xl border border-red-100 text-gray-800 leading-relaxed">
                                            {result.treatment}
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ) : (
                            <div key="empty" className="h-full flex flex-col items-center justify-center p-8 text-center opacity-50">
                                <div className="w-64 h-64 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                    <ScanLine size={64} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-medium text-gray-400">Ready to Scan</h3>
                                <p className="text-gray-400 max-w-xs mt-2">Upload a photo to detect diseases and get treatment advice.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default DiseaseDetection;
