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
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = React.useRef(null);
    const canvasRef = React.useRef(null);

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

        try {
            const response = await fetch('http://localhost:5001/api/disease/detect', {
                method: 'POST',
                body: formData, // Send as FormData
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
            alert("Network error. Please try again.");
        }
        setLoading(false);
    };

    // Cleanup camera on unmount
    React.useEffect(() => {
        return () => {
            if (isCameraOpen) stopCamera();
        };
    }, [isCameraOpen]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-6xl mx-auto space-y-8"
        >
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-100 rounded-2xl text-red-600">
                        <ScanLine size={32} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-gray-900">Plant Doctor</h1>
                        <p className="text-gray-500">Instant disease diagnosis from leaf photos.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* Local Language Selector */}
                    <select className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block p-2.5">
                        <option value="en">English</option>
                        <option value="hi">हिंदी</option>
                        <option value="te">తెలుగు</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card glass className="p-8 flex flex-col items-center">
                    <div className="w-full relative group">
                        <input
                            type="file"
                            id="fileInput"
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />

                        {isCameraOpen ? (
                            <div className="relative w-full h-80 rounded-3xl overflow-hidden bg-black flex items-center justify-center">
                                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                                <canvas ref={canvasRef} className="hidden" />
                                <div className="absolute bottom-4 flex gap-4">
                                    <button
                                        onClick={captureImage}
                                        className="p-3 bg-white text-red-600 rounded-full shadow-lg hover:scale-110 transition-transform"
                                    >
                                        <Camera size={32} />
                                    </button>
                                    <button
                                        onClick={stopCamera}
                                        className="p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700"
                                    >
                                        <X size={32} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => !preview && document.getElementById('fileInput').click()}
                                className={`
                                    relative w-full h-80 rounded-3xl border-3 border-dashed transition-all duration-300 flex flex-col items-center justify-center overflow-hidden
                                    ${preview ? 'border-red-400/50 bg-gray-900' : 'border-gray-300 hover:border-red-400 hover:bg-red-50/30 cursor-pointer'}
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
                                        <div className="flex justify-center gap-4 mb-4">
                                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                                                <Upload size={28} />
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); startCamera(); }}
                                                className="w-16 h-16 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
                                            >
                                                <Camera size={28} />
                                            </button>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900">Upload or Capture</h3>
                                        <p className="text-gray-500 text-sm mt-2 max-w-xs mx-auto">Upload a photo or use camera to scan the affected leaf.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {!isCameraOpen && (
                        <Button
                            onClick={handleSubmit}
                            disabled={!image || loading}
                            variant="danger"
                            className="w-full h-14 text-lg mt-6 bg-red-600 hover:bg-red-700 shadow-red-500/20"
                            isLoading={loading}
                        >
                            {loading ? 'Scanning Leaf...' : 'Diagnose Disease'}
                        </Button>
                    )}
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
                                    <div className="mt-2 inline-block px-3 py-1 bg-red-50 text-red-700 text-sm rounded-full border border-red-100">
                                        Confidence: <span className="font-bold">{(result.confidence * 100).toFixed(0)}%</span>
                                    </div>
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
