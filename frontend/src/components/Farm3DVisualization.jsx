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
    Activity,
    Shovel,
    Clock
} from 'lucide-react';
import * as THREE from 'three';
import { Button } from './ui/Button';

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
            onClick={(e) => { e.stopPropagation(); onClick(); }}
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

// Ground with grid for planting
const Ground = ({ onPlotClick, plantingMode }) => {
    const [hoveredPlot, setHoveredPlot] = useState(null);

    return (
        <group>
            {/* Base */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
                <planeGeometry args={[25, 25, 50, 50]} />
                <meshStandardMaterial color="#5D4037" roughness={0.9} />
            </mesh>

            {/* Grid for planting interaction */}
            {plantingMode && (
                <gridHelper args={[10, 10, 0xffffff, 0xffffff]} position={[0, 0.01, 0]} material-opacity={0.3} material-transparent />
            )}

            {/* Clickable Plots */}
            {plantingMode && [-2, -1, 0, 1, 2].map(x =>
                [-2, -1, 0, 1, 2].map(z => (
                    <mesh
                        key={`${x}-${z}`}
                        rotation={[-Math.PI / 2, 0, 0]}
                        position={[x * 1.2, 0.01, z * 1.2]}
                        onClick={(e) => {
                            e.stopPropagation();
                            onPlotClick([x * 1.2, 0, z * 1.2]);
                        }}
                        onPointerOver={() => setHoveredPlot(`${x}-${z}`)}
                        onPointerOut={() => setHoveredPlot(null)}
                    >
                        <planeGeometry args={[1, 1]} />
                        <meshBasicMaterial
                            color="#4CAF50"
                            transparent
                            opacity={hoveredPlot === `${x}-${z}` ? 0.3 : 0}
                            side={THREE.DoubleSide}
                        />
                    </mesh>
                ))
            )}
        </group>
    );
};

// Field Plots
const FieldPlot = ({ cropData, onCropClick, selectedCrop }) => {
    return (
        <group>
            {/* Soil bed visualization is now part of Ground/Grid */}
            {cropData.map((crop, idx) => (
                <Crop
                    key={crop.id}
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

// Timeline Component
const TaskTimeline = ({ currentDay }) => {
    const tasks = [
        { day: 10, title: 'Sowing', completed: currentDay > 10 },
        { day: 30, title: 'Irrigation', completed: currentDay > 30 },
        { day: 45, title: 'Fertilizer', completed: currentDay > 45 },
        { day: 60, title: 'Pest Control', completed: currentDay > 60 },
        { day: 90, title: 'Harvest', completed: currentDay > 90 },
    ];

    return (
        <div className="bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-white/40">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={16} className="text-agro-green" />
                Task Timeline
            </h3>
            <div className="relative pl-4 border-l-2 border-gray-200 space-y-4">
                {tasks.map((task, idx) => (
                    <div key={idx} className={`relative pl-4 transition-all duration-300 ${task.completed ? 'opacity-50' : 'opacity-100'}`}>
                        <div className={`absolute -left-[21px] top-1 w-3 h-3 rounded-full border-2 ${task.completed ? 'bg-green-500 border-green-500' :
                                currentDay >= task.day - 5 && currentDay <= task.day + 5 ? 'bg-yellow-400 border-yellow-400 animate-pulse' :
                                    'bg-white border-gray-300'
                            }`} />
                        <p className="text-xs font-semibold text-gray-500">Day {task.day}</p>
                        <p className={`text-sm font-medium ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {task.title}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Main 3D Farm Visualization Component
const Farm3DVisualization = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [selectedCrop, setSelectedCrop] = useState(null);
    const [viewMode, setViewMode] = useState('overview');
    const [showLabels, setShowLabels] = useState(true);
    const [weather, setWeather] = useState('sunny');
    const [irrigationActive, setIrrigationActive] = useState(false);
    const [tractorActive, setTractorActive] = useState(false);
    const [currentDay, setCurrentDay] = useState(45);

    // Planting Mode State
    const [plantingMode, setPlantingMode] = useState(false);
    const [selectedSeed, setSelectedSeed] = useState('Rice');

    // Initial randomly generated crops
    const [crops, setCrops] = useState([]);

    // Initialize crops once
    useEffect(() => {
        const initialCrops = [];
        const types = ['Rice', 'Wheat', 'Cotton', 'Maize'];
        for (let x = -1; x <= 1; x++) {
            for (let z = -1; z <= 1; z++) {
                if (Math.random() > 0.3) {
                    initialCrops.push({
                        id: `crop-${Date.now()}-${x}-${z}`,
                        position: [x * 1.2, 0, z * 1.2],
                        growthStage: 'vegetative',
                        health: 80 + Math.random() * 20,
                        type: types[Math.floor(Math.random() * types.length)],
                        plantedDay: 10
                    });
                }
            }
        }
        setCrops(initialCrops);
    }, []);

    // Update growth based on currentDay
    const visibleCrops = useMemo(() => {
        return crops.map(crop => {
            const age = currentDay - crop.plantedDay;
            let stage = 'seedling';
            if (age > 20) stage = 'vegetative';
            if (age > 50) stage = 'flowering';
            if (age > 80) stage = 'fruiting';
            if (age > 100) stage = 'mature';

            return { ...crop, growthStage: age > 0 ? stage : 'seedling', visible: age > 0 };
        }).filter(c => c.visible);
    }, [crops, currentDay]);

    const handlePlotClick = (position) => {
        if (!plantingMode) return;

        const newCrop = {
            id: `crop-${Date.now()}`,
            position: position,
            growthStage: 'seedling',
            health: 100,
            type: selectedSeed,
            plantedDay: currentDay
        };

        setCrops([...crops, newCrop]);

        // Visual feedback or sound could go here
    };

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
            className={`${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900' : 'max-w-7xl mx-auto'} space-y-4`}
        >
            {/* Header */}
            <div className="flex items-center justify-between gap-4 flex-wrap bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/40 shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl text-green-600 shadow-inner">
                        <Layers size={32} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-heading font-bold text-gray-900">Digital Farm Manager</h1>
                        <p className="text-gray-500 text-sm">Interactive 3D Field Planning</p>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        onClick={() => setPlantingMode(!plantingMode)}
                        variant={plantingMode ? 'primary' : 'outline'}
                        className="gap-2"
                    >
                        <Shovel size={18} />
                        {plantingMode ? 'Done Planting' : 'Plant Crops'}
                    </Button>

                    <button
                        onClick={() => speakText('Welcome to your Digital Farm. Use the controls to manage irrigation, track growth, and plan tasks.')}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                    >
                        <Volume2 size={20} className="text-gray-500" />
                    </button>
                    <button
                        onClick={() => setIsFullscreen(!isFullscreen)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                    >
                        {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                {/* Left Controls Panel */}
                <div className="lg:col-span-1 space-y-4">

                    {/* View Controls */}
                    <div className="bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-white/40 shadow-sm">
                        <h3 className="font-semibold text-gray-800 mb-3">View & Weather</h3>
                        <div className="space-y-3">
                            <select
                                value={viewMode}
                                onChange={(e) => setViewMode(e.target.value)}
                                className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            >
                                <option value="overview">Overview</option>
                                <option value="topdown">Top Down</option>
                                <option value="firstperson">First Person</option>
                            </select>
                            <select
                                value={weather}
                                onChange={(e) => setWeather(e.target.value)}
                                className="w-full p-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                            >
                                <option value="sunny">☀️ Sunny</option>
                                <option value="cloudy">☁️ Cloudy</option>
                                <option value="rainy">🌧️ Rainy</option>
                            </select>
                        </div>
                    </div>

                    {/* Timeline */}
                    <TaskTimeline currentDay={currentDay} />

                    {/* Planting Tools (Conditional) */}
                    <AnimatePresence>
                        {plantingMode && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-green-50/80 backdrop-blur-sm p-4 rounded-2xl border border-green-100 shadow-sm overflow-hidden"
                            >
                                <h3 className="font-semibold text-green-800 mb-2">Select Seeds</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Rice', 'Wheat', 'Cotton', 'Maize'].map(seed => (
                                        <button
                                            key={seed}
                                            onClick={() => setSelectedSeed(seed)}
                                            className={`p-2 rounded-lg text-sm text-center transition-all ${selectedSeed === seed
                                                    ? 'bg-green-500 text-white shadow-md'
                                                    : 'bg-white text-green-700 hover:bg-green-100'
                                                }`}
                                        >
                                            {seed}
                                        </button>
                                    ))}
                                </div>
                                <p className="text-xs text-green-600 mt-2 text-center">Click on grid to plant</p>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={() => setIrrigationActive(!irrigationActive)}
                            className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${irrigationActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            <Droplets size={24} className="mb-1" />
                            <span className="text-xs font-semibold">Irrigation</span>
                        </button>

                        <button
                            onClick={() => setTractorActive(!tractorActive)}
                            className={`p-3 rounded-xl flex flex-col items-center justify-center transition-all duration-300 ${tractorActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30' : 'bg-white hover:bg-gray-50'
                                }`}
                        >
                            <Activity size={24} className="mb-1" />
                            <span className="text-xs font-semibold">Machinery</span>
                        </button>
                    </div>
                </div>

                {/* 3D Canvas Area */}
                <div className="lg:col-span-3">
                    <div className={`w-full ${isFullscreen ? 'h-[calc(100vh-100px)]' : 'h-[600px]'} bg-gradient-to-b from-sky-200 via-sky-100 to-green-50 rounded-2xl overflow-hidden relative shadow-lg border border-white/20`}>
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
                                <Stars radius={100} depth={50} count={weather === 'sunny' ? 0 : 3000} factor={4} saturation={0} fade speed={1} />

                                {weather === 'cloudy' && (
                                    <>
                                        <Cloud opacity={0.8} speed={0.4} width={15} depth={2} segments={20} position={[-5, 8, -5]} />
                                        <Cloud opacity={0.6} speed={0.3} width={12} depth={1.5} segments={15} position={[5, 9, 5]} />
                                    </>
                                )}

                                <Ground onPlotClick={handlePlotClick} plantingMode={plantingMode} />
                                <FarmHouse />

                                <FieldPlot
                                    cropData={visibleCrops}
                                    onCropClick={setSelectedCrop}
                                    selectedCrop={selectedCrop}
                                />

                                <IrrigationSystem active={irrigationActive} type="drip" />
                                <Tractor position={[3, 0, 3]} active={tractorActive} />
                                <WeatherEffects weather={weather} />

                                {showLabels && (
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
                                )}
                            </Suspense>

                            <OrbitControls
                                enableZoom={true}
                                maxPolarAngle={Math.PI / 2.1}
                                minDistance={3}
                                maxDistance={20}
                                autoRotate={viewMode === 'overview' && !plantingMode}
                                autoRotateSpeed={0.5}
                            />
                        </Canvas>

                        {/* Overlays */}

                        {/* Day Progress */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-white/50 w-64">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Season Day</span>
                                <span className="text-xl font-bold text-gray-900">{currentDay}</span>
                            </div>
                            <input
                                type="range"
                                min="1"
                                max="120"
                                value={currentDay}
                                onChange={(e) => setCurrentDay(parseInt(e.target.value))}
                                className="w-full accent-green-600 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-[10px] text-gray-400 mt-1">
                                <span>Sowing</span>
                                <span>Growth</span>
                                <span>Harvest</span>
                            </div>
                        </div>

                        {/* Crop Info Panel */}
                        <AnimatePresence>
                            {selectedCrop && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 20 }}
                                    className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-lg w-72 border border-white/50"
                                >
                                    <div className="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="p-1.5 bg-green-100 rounded-lg text-green-600">
                                                <Sprout size={16} />
                                            </div>
                                            <h3 className="font-bold text-gray-900">{selectedCrop.type}</h3>
                                        </div>
                                        <button
                                            onClick={() => setSelectedCrop(null)}
                                            className="text-gray-400 hover:text-gray-600"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between p-2 bg-gray-50 rounded-lg">
                                            <span className="text-gray-500">Growth Stage</span>
                                            <span className="font-medium capitalize text-green-700">{selectedCrop.growthStage}</span>
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex justify-between items-center text-xs text-gray-500">
                                                <span>Health</span>
                                                <span>{Math.round(selectedCrop.health)}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${selectedCrop.health > 80 ? 'bg-green-500' :
                                                            selectedCrop.health > 50 ? 'bg-yellow-500' : 'bg-red-500'
                                                        }`}
                                                    style={{ width: `${selectedCrop.health}%` }}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-2 mt-2">
                                            <button className="text-xs bg-blue-50 text-blue-600 py-1.5 rounded-lg hover:bg-blue-100 font-medium">Water</button>
                                            <button className="text-xs bg-amber-50 text-amber-600 py-1.5 rounded-lg hover:bg-amber-100 font-medium">Fertilize</button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default Farm3DVisualization;
