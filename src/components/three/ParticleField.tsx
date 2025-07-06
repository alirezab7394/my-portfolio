"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Individual particle system with points
function Particles({ count = 50, color = "#3B82F6" }: { count?: number; color?: string }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Random positions in a large sphere
      const radius = Math.random() * 20 + 5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);

      sizes[i] = Math.random() * 2 + 0.5;
    }

    return { positions, sizes };
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.0005;
      pointsRef.current.rotation.x += 0.0002;

      // Gentle floating animation
      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        positions[i3 + 1] += Math.sin(state.clock.elapsedTime * 0.5 + i * 0.1) * 0.005;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[particles.positions, 3]} />
        <bufferAttribute attach="attributes-size" args={[particles.sizes, 1]} />
      </bufferGeometry>
      <pointsMaterial size={1} color={color} transparent opacity={0.6} sizeAttenuation vertexColors={false} />
    </points>
  );
}

// Circles using instanced mesh
function CircleParticles({ count = 15, color = "#8B5CF6" }: { count?: number; color?: string }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 15 + 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      pos.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        scale: Math.random() * 0.3 + 0.1,
      });
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0008;
      meshRef.current.rotation.x += 0.0003;

      positions.forEach((pos, i) => {
        dummy.position.set(pos.x, pos.y + Math.sin(state.clock.elapsedTime * 0.8 + i * 0.2) * 0.3, pos.z);
        dummy.scale.setScalar(pos.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <circleGeometry args={[0.5, 16]} />
      <meshBasicMaterial color={color} transparent opacity={0.4} />
    </instancedMesh>
  );
}

// Squares using instanced mesh
function SquareParticles({ count = 12, color = "#06B6D4" }: { count?: number; color?: string }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      const radius = Math.random() * 18 + 6;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      pos.push({
        x: radius * Math.sin(phi) * Math.cos(theta),
        y: radius * Math.sin(phi) * Math.sin(theta),
        z: radius * Math.cos(phi),
        scale: Math.random() * 0.4 + 0.2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.0006;
      meshRef.current.rotation.x += 0.0004;

      positions.forEach((pos, i) => {
        dummy.position.set(pos.x, pos.y + Math.sin(state.clock.elapsedTime * 0.6 + i * 0.15) * 0.2, pos.z);
        dummy.rotation.z += pos.rotationSpeed;
        dummy.scale.setScalar(pos.scale);
        dummy.updateMatrix();
        meshRef.current!.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[1, 1]} />
      <meshBasicMaterial color={color} transparent opacity={0.3} />
    </instancedMesh>
  );
}

// Main ParticleField component
interface ParticleFieldProps {
  particleCount?: number;
  colors?: string[];
  className?: string;
}

export default function ParticleField({
  particleCount = 80, // Reduced from 150
  colors = ["#3B82F6", "#8B5CF6", "#06B6D4"],
  className = "",
}: ParticleFieldProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      <Canvas camera={{ position: [0, 0, 15], fov: 60 }} style={{ background: "transparent" }}>
        {/* Points particles */}
        <Particles count={Math.floor(particleCount * 0.6)} color={colors[0]} />

        {/* Circle particles */}
        <CircleParticles count={Math.floor(particleCount * 0.2)} color={colors[1]} />

        {/* Square particles */}
        <SquareParticles count={Math.floor(particleCount * 0.15)} color={colors[2]} />

        {/* Subtle ambient lighting */}
        <ambientLight intensity={0.2} />
      </Canvas>
    </div>
  );
}
