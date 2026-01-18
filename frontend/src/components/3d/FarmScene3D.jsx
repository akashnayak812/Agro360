import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, Stars, Cloud } from '@react-three/drei';

const Crop = ({ position, color }) => {
    const mesh = useRef();

    useFrame((state, delta) => {
        // Sway animation simulating wind
        mesh.current.rotation.z = Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.1;
    });

    return (
        <group position={position} ref={mesh}>
            {/* Stem */}
            <mesh position={[0, 0.5, 0]}>
                <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
                <meshStandardMaterial color="#4CAF50" />
            </mesh>
            {/* Leaf */}
            <mesh position={[0.2, 0.8, 0]} rotation={[0, 0, -0.5]}>
                <sphereGeometry args={[0.2, 8, 8]} />
                <meshStandardMaterial color={color} />
            </mesh>
        </group>
    );
};

const FarmHouse = () => {
    return (
        <group position={[-3, 0.5, -3]}>
            <mesh position={[0, 0.5, 0]}>
                <boxGeometry args={[2, 1, 2]} />
                <meshStandardMaterial color="#8D6E63" />
            </mesh>
            <mesh position={[0, 1.5, 0]} rotation={[0, Math.PI / 4, 0]}>
                <coneGeometry args={[1.6, 1, 4]} />
                <meshStandardMaterial color="#5D4037" />
            </mesh>
        </group>
    )
}

const WeatherParticles = () => {
    const mesh = useRef();
    // Simulate simple rain for demo
    useFrame((state) => {
        mesh.current.rotation.y += 0.005;
    });

    return (
        <points ref={mesh}>
            <sphereGeometry args={[10, 32, 32]} />
            <pointsMaterial size={0.05} color="#81D4FA" transparent opacity={0.4} />
        </points>
    )
}

const FarmScene3D = () => {
    return (
        <div className="absolute inset-0 -z-10 h-full w-full">
            <Canvas camera={{ position: [5, 5, 10], fov: 45 }}>
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                <Cloud opacity={0.5} speed={0.4} width={10} depth={1.5} segments={20} position={[0, 5, -10]} />

                {/* Ground */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]}>
                    <planeGeometry args={[20, 20]} />
                    <meshStandardMaterial color="#C5E1A5" />
                </mesh>

                <FarmHouse />

                {/* Grid of Crops */}
                {[-2, -1, 0, 1, 2].map((x) =>
                    [-1, 0, 1].map((z) => (
                        <Crop key={`${x}-${z}`} position={[x * 1.5, 0, z * 1.5]} color="#66BB6A" />
                    ))
                )}

                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                    <Text
                        font="/fonts/Inter-Bold.woff" // Fallback to default if load fails
                        fontSize={1}
                        color="#2E7D32"
                        position={[0, 3, 0]}
                        anchorX="center"
                        anchorY="middle"
                    >
                        Agro360
                    </Text>
                </Float>

                <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
                <WeatherParticles />
            </Canvas>
        </div>
    );
};

export default FarmScene3D;
