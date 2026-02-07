import React, { useRef, useState, useEffect, Suspense, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars, Cloud, Html, PerspectiveCamera, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Eye,
    Maximize2,
    Minimize2,
    RefreshCw,
    Droplets,
    Sun,
    CloudRain,
    Bug,
    Sprout,
    Volume2,
    Info,
    Layers,
    Map,
    Calendar,
    Activity
} from 'lucide-react';
import * as THREE from 'three';

// Enhanced Crop Component with Growth Stages
const Crop = ({ position, growthStage, health, type, onClick, isSelected }) => {
    const mesh = useRef();
    const [hovered, setHovered] = useState(false);

    // Growth stage affects height and color
    const stageConfig = {
        seedling: { height: 0.3, leafSize: 0.1, color: '#90EE90' },
        vegetative: { height: 0.6, leafSize: 0.15, color: '#4CAF50' },
        flowering: { height: 0.9, leafSize: 0.2, color: '#66BB6A' },
        fruiting: { height: 1.1, leafSize: 0.25, color: '#2E7D32' },
        mature: { height: 1.2, leafSize: 0.3, color: '#1B5E20' }
    };

    const config = stageConfig[growthStage] || stageConfig.vegetative;
    
    // Health affects opacity/saturation
    const healthColor = health > 80 ? config.color : health > 50 ? '#FFA726' : '#EF5350';

    useFrame((state) => {
        if (mesh.current) {
            // Sway animation
            mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.05;
            // Hover effect
            if (hovered) {
                mesh.current.scale.setScalar(1.1);
            } else {
                mesh.current.scale.setScalar(1);
            }
        }
    });

    return (
        <group 
            position={position} 
            ref={mesh}
            onClick={onClick}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            {/* Stem */}
            <mesh position={[0, config.height / 2, 0]}>
                <cylinderGeometry args={[0.03, 0.05, config.height, 8]} />
                <meshStandardMaterial color="#8BC34A" />
            </mesh>
            
            {/* Leaves */}
            {[0, 1, 2, 3].map((i) => (
                <mesh 
                    key={i}
                    position={[
                        Math.cos(i * Math.PI / 2) * 0.15,
                        config.height * 0.7,
                        Math.sin(i * Math.PI / 2) * 0.15
                    ]}
                    rotation={[0.3, i * Math.PI / 2, 0]}
                >
                    <sphereGeometry args={[config.leafSize, 8, 8]} />
                    <meshStandardMaterial color={healthColor} transparent opacity={health / 100} />
                </mesh>
            ))}

            {/* Fruit/Flower for mature stages */}
            {(growthStage === 'flowering' || growthStage === 'fruiting') && (
                <mesh position={[0, config.height, 0]}>
                    <sphereGeometry args={[growthStage === 'fruiting' ? 0.15 : 0.08, 16, 16]} />
                    <meshStandardMaterial 
                        color={growthStage === 'fruiting' ? '#FF5722' : '#E91E63'} 
                    />
                </mesh>
            )}

            {/* Selection indicator */}
            {isSelected && (
                <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.3, 0.35, 32]} />
                    <meshBasicMaterial color="#2196F3" side={THREE.DoubleSide} />
                </mesh>
            )}

            {/* Hover label */}
            {hovered && (
                <Html position={[0, config.height + 0.5, 0]} center>
                    <div className="bg-white/90 backdrop-blur-sm px-3 py-2 rounded-lg shadow-lg text-xs whitespace-nowrap">
                        <div className="font-semibold text-gray-900">{type}</div>
                        <div className="text-gray-600">Health: {health}%</div>
                        <div className="text-gray-600">Stage: {growthStage}</div>
                    </div>
                </Html>
            )}
        </group>
    );
};

// Irrigation System
const IrrigationSystem = ({ active, type }) => {
    const sprinklerRef = useRef();
    
    useFrame((state) => {
        if (sprinklerRef.current && active) {
            sprinklerRef.current.rotation.y += 0.05;
        }
    });

    if (type === 'drip') {
        return (
            <group>
                {[-2, 0, 2].map((x) => (
                    <mesh key={x} position={[x, 0.02, 0]}>
                        <cylinderGeometry args={[0.02, 0.02, 6, 8]} />
                        <meshStandardMaterial color="#3E2723" />
                    </mesh>
                ))}
                {active && [-2, 0, 2].map((x) => 
                    [-2, 0, 2].map((z) => (
                        <mesh key={`${x}-${z}`} position={[x, 0.1, z]}>
                            <sphereGeometry args={[0.05, 8, 8]} />
                            <meshStandardMaterial color="#2196F3" transparent opacity={0.7} />
                        </mesh>
                    ))
                )}
            </group>
        );
    }

    return (
        <group ref={sprinklerRef} position={[0, 0.5, 0]}>
            <mesh>
                <cylinderGeometry args={[0.1, 0.15, 0.3, 8]} />
                <meshStandardMaterial color="#757575" />
            </mesh>
            {active && (
                <points>
                    <sphereGeometry args={[2, 32, 32]} />
                    <pointsMaterial size={0.03} color="#2196F3" transparent opacity={0.5} />
                </points>
            )}
        </group>
    );
};

// Farm House with Details
const FarmHouse = () => {
    return (
        <group position={[-4, 0, -4]}>
            {/* Main building */}
            <mesh position={[0, 0.6, 0]}>
                <boxGeometry args={[2.5, 1.2, 2]} />
                <meshStandardMaterial color="#8D6E63" />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 1.6, 0]} rotation={[0, Math.PI / 4, 0]}>
                <coneGeometry args={[2, 1, 4]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            {/* Door */}
            <mesh position={[0, 0.4, 1.01]}>
                <planeGeometry args={[0.5, 0.8]} />
                <meshStandardMaterial color="#3E2723" />
            </mesh>
            {/* Windows */}
            {[-0.6, 0.6].map((x) => (
                <mesh key={x} position={[x, 0.7, 1.01]}>
                    <planeGeometry args={[0.4, 0.4]} />
                    <meshStandardMaterial color="#81D4FA" />
                </mesh>
            ))}
        </group>
    );
};

// Tractor
const Tractor = ({ position, active }) => {
    const tractorRef = useRef();

    useFrame((state) => {
        if (tractorRef.current && active) {
            tractorRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.5) * 3;
        }
    });

    return (
        <group ref={tractorRef} position={position}>
            {/* Body */}
            <mesh position={[0, 0.4, 0]}>
                <boxGeometry args={[1, 0.5, 0.6]} />
                <meshStandardMaterial color="#F44336" />
            </mesh>
            {/* Cabin */}
            <mesh position={[-0.2, 0.8, 0]}>
                <boxGeometry args={[0.5, 0.4, 0.5]} />
                <meshStandardMaterial color="#1565C0" />
            </mesh>
            {/* Wheels */}
            {[[-0.35, 0.2, 0.35], [-0.35, 0.2, -0.35], [0.35, 0.3, 0.4], [0.35, 0.3, -0.4]].map((pos, i) => (
                <mesh key={i} position={pos} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[i < 2 ? 0.2 : 0.3, i < 2 ? 0.2 : 0.3, 0.1, 16]} />
                    <meshStandardMaterial color="#212121" />
                </mesh>
            ))}
        </group>
    );
};

// Weather Effects
const WeatherEffects = ({ weather }) => {
    const rainRef = useRef();
    const sunRef = useRef();

    useFrame((state) => {
        if (rainRef.current) {
            rainRef.current.rotation.y += 0.002;
            rainRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.5 + 5;
        }
        if (sunRef.current) {
            sunRef.current.rotation.y += 0.005;
        }
    });

    if (weather === 'rainy') {
        return (
            <group ref={rainRef} position={[0, 5, 0]}>
                <points>
                    <boxGeometry args={[15, 8, 15]} />
                    <pointsMaterial size={0.02} color="#2196F3" transparent opacity={0.6} />
                </points>
            </group>
        );
    }

    if (weather === 'sunny') {
        return (
            <group ref={sunRef} position={[5, 8, 5]}>
                <mesh>
                    <sphereGeometry args={[1, 32, 32]} />
                    <meshBasicMaterial color="#FFC107" />
                </mesh>
                <pointLight color="#FFF59D" intensity={2} distance={20} />
            </group>
        );
    }

    return null;
};

// Pest Indicator
const PestIndicator = ({ position, severity }) => {
    const meshRef = useRef();

    useFrame((state) => {
        if (meshRef.current) {
            meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 3) * 0.1 + 1.5;
        }
    });

    if (severity === 'none') return null;

    return (
        <group position={position}>
            <mesh ref={meshRef}>
                <sphereGeometry args={[0.15, 16, 16]} />
                <meshStandardMaterial 
                    color={severity === 'high' ? '#F44336' : severity === 'medium' ? '#FF9800' : '#4CAF50'} 
                    emissive={severity === 'high' ? '#F44336' : '#000000'}
                    emissiveIntensity={0.3}
                />
            </mesh>
            <Html position={[0, 0.3, 0]} center>
                <div className={`px-2 py-1 rounded text-xs font-medium ${
                    severity === 'high' ? 'bg-red-500 text-white' :
                    severity === 'medium' ? 'bg-orange-500 text-white' :
                    'bg-green-500 text-white'
                }`}>
                    🐛 {severity}
                </div>
            </Html>
        </group>
    );
};

// Ground with texture effect
const Ground = () => {
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
            <planeGeometry args={[25, 25, 50, 50]} />
            <meshStandardMaterial 
                color="#8D6E63"
                roughness={0.9}
            />
        </mesh>
    );
};

// Field Plots
const FieldPlot = ({ position, size, cropData, onCropClick, selectedCrop }) => {
    return (
        <group position={position}>
            {/* Soil bed */}
            <mesh position={[0, 0.02, 0]}>
                <boxGeometry args={[size[0], 0.05, size[1]]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
            
            {/* Crops Grid */}
            {cropData.map((crop, idx) => (
                <Crop
                    key={idx}
                    position={crop.position}
                    growthStage={crop.growthStage}
                    health={crop.health}
                    type={crop.type}
                    onClick={() => onCropClick(crop)}
                    isSelected={selectedCrop?.id === crop.id}
                />
            ))}
        </group>
    );
};

// Main 3D Farm Visualization Component
const Farm3DVisualization = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [viewMode, setViewMode] = useState('overview'); // overview, topdown, firstperson
    const [showLabels, setShowLabels] = useState(true);
    const [weather, setWeather] = useState('sunny');
    const [irrigationActive, setIrrigationActive] = useState(false);
    const [tractorActive, setTractorActive] = useState(false);
    const [currentDay, setCurrentDay] = useState(45);

    // Generate crop data
    const cropData = useMemo(() => {
        const crops = [];
        const stages = ['seedling', 'vegetative', 'flowering', 'fruiting', 'mature'];
        const types = ['Rice', 'Wheat', 'Cotton', 'Maize'];
        
        for (let x = -2; x <= 2; x++) {
            for (let z = -2; z <= 2; z++) {
                const stageIndex = Math.min(Math.floor(currentDay / 25), 4);
                crops.push({
                    id: `crop-${x}-${z}`,
                    position: [x * 1.2, 0, z * 1.2],
                    growthStage: stages[stageIndex],
                    health: 70 + Math.random() * 30,
                    type: types[Math.floor(Math.random() * types.length)]
                });
            }
        }
        return crops;
    }, [currentDay]);

    const speakText = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'en-IN';
            window.speechSynthesis.speak(utterance);
        }
    };

    const cameraPositions = {
        overview: [8, 8, 8],
        topdown: [0, 15, 0],
        firstperson: [0, 1.5, 8]
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isFullscreen ? 'fixed inset-0 z-50' : 'max-w-7xl mx-auto'} space-y-4`}
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap bg-white/80 backdrop-blur-sm p-4 rounded-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl text-green-600">
                        <Layers size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-gray-900">3D Farm Visualization</h1>
                        <p className="text-gray-500 text-sm">Interactive view of your farm</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => speakText('This is your 3D farm visualization. You can see your crops, their growth stages, irrigation system, and weather conditions. Click on any crop to see details.')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Read Aloud"
                    >
                        <Volume2 size={20} className="text-gray-500" />
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>
            </div>

            {/* Controls Panel */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {/* View Mode */}
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
                    <label className="text-xs font-medium text-gray-500 block mb-2">View</label>
                    <select
                        value={viewMode}
                        onChange={(e) => setViewMode(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-200 rounded-lg"
                    >
                        <option value="overview">Overview</option>
                        <option value="topdown">Top Down</option>
                        <option value="firstperson">First Person</option>
                    </select>
                </div>

                {/* Weather */}
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl">
                    <label className="text-xs font-medium text-gray-500 block mb-2">Weather</label>
                    <select
                        value={weather}
                        onChange={(e) => setWeather(e.target.value)}
                        className="w-full p-2 text-sm border border-gray-200 rounded-lg"
                    >
                        <option value="sunny">☀️ Sunny</option>
                        <option value="cloudy">☁️ Cloudy</option>
                        <option value="rainy">🌧️ Rainy</option>
                    </select>
                </div>

                {/* Day Slider */}
                <div className="bg-white/80 backdrop-blur-sm p-3 rounded-xl col-span-2">
                    <label className="text-xs font-medium text-gray-500 block mb-2 flex items-center gap-1">
                        <Calendar size={12} />
                        Day {currentDay}/120
                    </label>
                    <input
                        type="range"
                        min="1"
                        max="120"
                        value={currentDay}
                        onChange={(e) => setCurrentDay(parseInt(e.target.value))}
                        className="w-full"
                    />
                </div>

                {/* Irrigation Toggle */}
                <button
                    onClick={() => setIrrigationActive(!irrigationActive)}
                    className={`p-3 rounded-xl flex flex-col items-center justify-center transition-colors ${
                        irrigationActive ? 'bg-blue-100 text-blue-600' : 'bg-white/80 text-gray-500'
                    }`}
                >
                    <Droplets size={20} />
                    <span className="text-xs mt-1">Irrigation</span>
                </button>

                {/* Tractor Toggle */}
                <button
                    onClick={() => setTractorActive(!tractorActive)}
                    className={`p-3 rounded-xl flex flex-col items-center justify-center transition-colors ${
                        tractorActive ? 'bg-green-100 text-green-600' : 'bg-white/80 text-gray-500'
                    }`}
                >
                    <Activity size={20} />
                    <span className="text-xs mt-1">Activity</span>
                </button>
            </div>

            {/* 3D Canvas */}
            <div className={`${isFullscreen ? 'h-[calc(100vh-200px)]' : 'h-[500px]'} bg-gradient-to-b from-sky-200 to-sky-100 rounded-2xl overflow-hidden relative`}>
                <Canvas shadows>
                    <PerspectiveCamera 
                        makeDefault 
                        position={cameraPositions[viewMode]} 
                        fov={50}
                    />
                    <ambientLight intensity={0.6} />
                    <directionalLight 
                        position={[10, 15, 10]} 
                        intensity={1} 
                        castShadow
                        shadow-mapSize={[2048, 2048]}
                    />
                    
                    <Suspense fallback={null}>
                        {/* Sky */}
                        <Stars radius={100} depth={50} count={weather === 'sunny' ? 0 : 3000} factor={4} saturation={0} fade speed={1} />
                        
                        {weather === 'cloudy' && (
                            <>
                                <Cloud opacity={0.8} speed={0.4} width={15} depth={2} segments={20} position={[-5, 8, -5]} />
                                <Cloud opacity={0.6} speed={0.3} width={12} depth={1.5} segments={15} position={[5, 9, 5]} />
                            </>
                        )}

                        <Ground />
                        <FarmHouse />
                        
                        <FieldPlot
                            position={[0, 0, 0]}
                            size={[8, 8]}
                            cropData={cropData}
                            onCropClick={setSelectedCrop}
                            selectedCrop={selectedCrop}
                        />

                        <IrrigationSystem active={irrigationActive} type="drip" />
                        <Tractor position={[3, 0, 3]} active={tractorActive} />
                        <WeatherEffects weather={weather} />

                        {/* Labels */}
                        {showLabels && (
                            <>
                                <Float speed={2} rotationIntensity={0.2} floatIntensity={0.3}>
                                    <Text
                                        fontSize={0.5}
                                        color="#1B5E20"
                                        position={[0, 4, 0]}
                                        anchorX="center"
                                        anchorY="middle"
                                    >
                                        Agro360 Farm
                                    </Text>
                                </Float>
                            </>
                        )}
                    </Suspense>

                    <OrbitControls 
                        enableZoom={true}
                        maxPolarAngle={Math.PI / 2.1}
                        minDistance={3}
                        maxDistance={20}
                        autoRotate={viewMode === 'overview'}
                        autoRotateSpeed={0.5}
                    />
                </Canvas>

                {/* Crop Info Panel */}
                <AnimatePresence>
                    {selectedCrop && (
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg w-64"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="font-bold text-gray-900">{selectedCrop.type}</h3>
                                <button
                                    onClick={() => setSelectedCrop(null)}
                                    className="text-gray-400 hover:text-gray-600"
                                >
                                    ✕
                                </button>
                            </div>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Growth Stage</span>
                                    <span className="font-medium capitalize">{selectedCrop.growthStage}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-500">Health</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${
                                                    selectedCrop.health > 80 ? 'bg-green-500' :
                                                    selectedCrop.health > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                }`}
                                                style={{ width: `${selectedCrop.health}%` }}
                                            />
                                        </div>
                                        <span className="font-medium">{Math.round(selectedCrop.health)}%</span>
                                    </div>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Position</span>
                                    <span className="font-medium">Plot {selectedCrop.id}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => speakText(`${selectedCrop.type} crop. Growth stage is ${selectedCrop.growthStage}. Health is ${Math.round(selectedCrop.health)} percent.`)}
                                className="mt-3 w-full flex items-center justify-center gap-2 p-2 bg-green-50 text-green-600 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                            >
                                <Volume2 size={16} />
                                Read Details
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl text-xs space-y-1">
                    <div className="font-semibold text-gray-700 mb-2">Growth Stages</div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#90EE90]" />
                        <span>Seedling</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#4CAF50]" />
                        <span>Vegetative</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#66BB6A]" />
                        <span>Flowering</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#2E7D32]" />
                        <span>Fruiting</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#1B5E20]" />
                        <span>Mature</span>
                    </div>
                </div>

                {/* Day indicator */}
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl">
                    <div className="text-xs text-gray-500">Season Progress</div>
                    <div className="text-lg font-bold text-gray-900">Day {currentDay}</div>
                    <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
                        <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${(currentDay / 120) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Farm Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Crops', value: cropData.length, icon: Sprout, color: 'green' },
                    { label: 'Avg Health', value: `${Math.round(cropData.reduce((a, c) => a + c.health, 0) / cropData.length)}%`, icon: Activity, color: 'blue' },
                    { label: 'Irrigation', value: irrigationActive ? 'Active' : 'Off', icon: Droplets, color: 'cyan' },
                    { label: 'Weather', value: weather.charAt(0).toUpperCase() + weather.slice(1), icon: weather === 'sunny' ? Sun : CloudRain, color: 'yellow' }
                ].map((stat, idx) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className={`bg-${stat.color}-50 p-4 rounded-xl border border-${stat.color}-100`}
                    >
                        <div className="flex items-center gap-2 text-gray-600 mb-1">
                            <stat.icon size={16} />
                            <span className="text-sm">{stat.label}</span>
                        </div>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
};

export default Farm3DVisualization;
