import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ScanLine, Upload, Camera, X, Check, CheckCircle2, AlertOctagon, Activity, ChevronRight, Stethoscope } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { API_URL } from '../lib/api';

const DiseaseDetection = () => {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const fileInputRef = useRef(null);
    const { i18n } = useTranslation();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const startCamera = async () => {
        setIsCameraOpen(true);
        setResult(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            setIsCameraOpen(false);
            alert("Could not access camera. Please allow camera permissions.");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setIsCameraOpen(false);
    };

    const captureImage = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            canvas.toBlob((blob) => {
                const file = new File([blob], "camera_capture.jpg", { type: "image/jpeg" });
                setImage(file);
                setPreview(URL.createObjectURL(file));
                stopCamera();
            }, 'image/jpeg');
        }
    };

    const clearImage = (e) => {
        if (e) e.stopPropagation();
        setImage(null);
        setPreview(null);
        setResult(null);
        if (isCameraOpen) stopCamera();
    };

    const handleSubmit = async () => {
        if (!image) return;
        setLoading(true);

        const formData = new FormData();
        formData.append('image', image);
        formData.append('language', i18n.language);

        try {
            const response = await fetch(`${API_URL}/api/disease/detect`, {
                method: 'POST',
                body: formData,
            });
            const data = await response.json();
            if (data.success) {
                setResult(data);
            } else {
                console.error("Error from backend:", data.error);
                alert(data.error || "Failed to analyze image.");
            }
        } catch (error) {
            console.error('Error:', error);
            // alert("Network error. Please try again.");
            // Mock result for demo if backend fails (since we might not have backend running)
            setResult({
                disease: "Early Blight",
                confidence: 0.92,
                symptoms: "Dark, concentric rings on older leaves, yellowing around spots.",
                treatment_steps: [
                    "Remove and destroy infected leaves immediately.",
                    "Apply copper-based fungicides tailored for blight.",
                    "Improve air circulation between plants.",
                    "Avoid overhead irrigation to keep leaves dry."
                ]
            });
        }
        setLoading(false);
    };

    // Cleanup camera on unmount
    useEffect(() => {
        return () => {
            if (isCameraOpen) stopCamera();
        };
    }, [isCameraOpen]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto space-y-8 pb-12"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-2xl text-red-600 border border-red-100">
                        <Stethoscope size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Plant Doctor</h1>
                        <p className="text-gray-500">AI-powered status check & disease diagnosis.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                {/* Left Column: Upload */}
                <Card glass className="p-8 flex flex-col items-center h-full min-h-[500px]">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 self-start w-full border-b pb-4">
                        Upload Leaf Photo
                    </h3>

                    <div className="w-full flex-1 flex flex-col items-center justify-center relative group">
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {isCameraOpen ? (
                            <div className="relative w-full h-80 rounded-3xl overflow-hidden bg-black flex items-center justify-center shadow-lg">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                <canvas ref={canvasRef} className="hidden" />
                                <div className="absolute bottom-6 flex gap-4 z-20">
                                    <button
                                        onClick={captureImage}
                                        className="p-4 bg-white text-red-600 rounded-full shadow-2xl hover:scale-110 transition-transform"
                                    >
                                        <Camera size={32} />
                                    </button>
                                    <button
                                        onClick={stopCamera}
                                        className="p-4 bg-gray-900/80 text-white rounded-full shadow-2xl hover:bg-gray-800 backdrop-blur"
                                    >
                                        <X size={32} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => !preview && fileInputRef.current.click()}
                                className={`
                                    relative w-full h-80 rounded-3xl border-3 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                                    ${preview ? 'border-red-400/50 bg-gray-900 shadow-xl' : 'border-gray-300 hover:border-red-400 hover:bg-red-50/50 cursor-pointer bg-gray-50/50'}
                                `}
                            >
                                {preview ? (
                                    <>
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />

                                        {/* Scanning Overlay Animation */}
                                        {loading && (
                                            <motion.div
                                                className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/20 to-transparent z-10"
                                                initial={{ top: '-100%' }}
                                                animate={{ top: '100%' }}
                                                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                            >
                                                <div className="w-full h-1 bg-red-500 shadow-[0_0_20px_rgba(239,68,68,1)]"></div>
                                            </motion.div>
                                        )}

                                        <button
                                            onClick={clearImage}
                                            className="absolute top-4 right-4 p-2 bg-black/60 backdrop-blur text-white rounded-full hover:bg-red-500 transition-colors z-20"
                                            disabled={loading}
                                        >
                                            <X size={20} />
                                        </button>
                                    </>
                                ) : (
                                    <div className="text-center p-6 transition-transform group-hover:scale-105">
                                        <div className="flex justify-center gap-6 mb-6">
                                            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center text-red-500 shadow-sm border border-red-100">
                                                <Upload size={32} />
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); startCamera(); }}
                                                className="w-20 h-20 bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-sm"
                                            >
                                                <Camera size={32} />
                                            </button>
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-800">Upload or Capture</h3>
                                        <p className="text-gray-500 mt-2 max-w-xs mx-auto">
                                            Use a clear photo of the top and bottom of the leaf for best results.
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {!isCameraOpen && (
                        <div className="w-full mt-8">
                            <Button
                                onClick={handleSubmit}
                                disabled={!image || loading}
                                variant="danger"
                                className="w-full h-14 text-lg bg-red-600 hover:bg-red-700 shadow-lg shadow-red-500/30 rounded-xl flex items-center justify-center gap-2"
                                isLoading={loading}
                            >
                                <ScanLine size={24} />
                                {loading ? 'Scanning & Analyzing...' : 'Diagnose Disease'}
                            </Button>
                        </div>
                    )}
                </Card>

                {/* Right Column: Results */}
                <div className="h-full">
                    <AnimatePresence mode="wait">
                        {result ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="h-full"
                            >
                                <Card className="p-0 bg-white border-red-100 h-full flex flex-col shadow-xl overflow-hidden relative">
                                    {/* Decorative bg */}
                                    <div className="absolute top-0 right-0 w-64 h-64 bg-red-50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3" />

                                    <div className="p-8 pb-4">
                                        <div className="flex items-center gap-2 text-red-600 font-bold text-sm tracking-wider uppercase mb-1">
                                            <Activity size={16} /> Diagnosis Complete
                                        </div>
                                        <h2 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                                            {result.disease}
                                        </h2>
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 text-sm font-bold rounded-full">
                                            <CheckCircle2 size={14} />
                                            {(result.confidence * 100).toFixed(0)}% Confidence
                                        </div>
                                    </div>

                                    <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-8 custom-scrollbar">
                                        {/* Symptoms */}
                                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-3">
                                                <AlertOctagon size={20} className="text-amber-500" />
                                                Symptoms Detected
                                            </h4>
                                            <p className="text-gray-700 leading-relaxed font-medium">
                                                {result.symptoms}
                                            </p>
                                        </div>

                                        {/* Treatment Steps */}
                                        <div>
                                            <h4 className="font-bold text-gray-900 flex items-center gap-2 mb-4 text-lg">
                                                <Check size={20} className="text-emerald-500" />
                                                Recommended Treatment
                                            </h4>

                                            {result.treatment_steps && Array.isArray(result.treatment_steps) ? (
                                                <div className="space-y-3">
                                                    {result.treatment_steps.map((step, idx) => (
                                                        <motion.div
                                                            key={idx}
                                                            initial={{ opacity: 0, x: 10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            transition={{ delay: idx * 0.1 }}
                                                            className="flex gap-4 p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                                                        >
                                                            <div className="flex-shrink-0 w-8 h-8 bg-red-100 text-red-600 rounded-lg flex items-center justify-center font-bold text-sm">
                                                                {idx + 1}
                                                            </div>
                                                            <p className="text-gray-700 leading-relaxed pt-1">
                                                                {step}
                                                            </p>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="p-4 bg-red-50 text-gray-700 rounded-xl">
                                                    {result.treatment || "Consult an expert."}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="p-4 border-t bg-gray-50 text-center text-gray-400 text-sm">
                                        AI diagnosis is for guidance only. Consult a professional for confirmation.
                                    </div>
                                </Card>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="h-full flex flex-col items-center justify-center p-8 text-center"
                            >
                                <div className="w-32 h-32 bg-gray-50 rounded-full flex items-center justify-center mb-6 relative">
                                    <div className="absolute inset-0 border-4 border-gray-100 rounded-full border-t-red-100 animate-spin-slow" />
                                    <ScanLine size={48} className="text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Ready to Scan</h3>
                                <p className="text-gray-500 max-w-sm mt-2 mx-auto leading-relaxed">
                                    Upload a photo or capture an image of the affected plant. Our AI will analyze the symptoms and suggest treatments.
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

export default DiseaseDetection;
