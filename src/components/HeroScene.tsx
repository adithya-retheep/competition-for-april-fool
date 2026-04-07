import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Text, Sparkles, MeshDistortMaterial, Environment } from "@react-three/drei";
import { useRef, useMemo } from "react";
import * as THREE from "three";

function FloatingEmoji({ emoji, position, speed }: { emoji: string; position: [number, number, number]; speed: number }) {
  const ref = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * speed * 0.5;
      ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * speed) * 0.3;
    }
  });

  return (
    <group ref={ref} position={position}>
      <Text fontSize={0.6} anchorX="center" anchorY="middle">
        {emoji}
      </Text>
    </group>
  );
}

function GlassSphere() {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.2;
      ref.current.rotation.z = state.clock.elapsedTime * 0.3;
    }
  });

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <icosahedronGeometry args={[1.5, 4]} />
      <MeshDistortMaterial
        color="#00ffff"
        attach="material"
        distort={0.4}
        speed={2}
        roughness={0.1}
        metalness={0.9}
        opacity={0.6}
        transparent
      />
    </mesh>
  );
}

function FloatingParticles() {
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < 50; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
        ] as [number, number, number],
        speed: Math.random() * 0.5 + 0.2,
      });
    }
    return temp;
  }, []);

  return (
    <>
      {particles.map((p, i) => (
        <Float key={`hero-particle-${i}`} speed={p.speed * 3} floatIntensity={2} rotationIntensity={1}>
          <mesh position={p.position}>
            <sphereGeometry args={[0.02 + Math.random() * 0.03, 8, 8]} />
            <meshStandardMaterial
              color={i % 2 === 0 ? "#00ffff" : "#ff00ff"}
              emissive={i % 2 === 0 ? "#00ffff" : "#ff00ff"}
              emissiveIntensity={2}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
}

export default function HeroScene() {
  return (
    <div className="hero-canvas">
      <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
        <Environment preset="night" />
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} color="#00ffff" />
        <directionalLight position={[-5, -5, 5]} intensity={0.3} color="#ff00ff" />

        <GlassSphere />
        <FloatingParticles />

        <FloatingEmoji emoji="🎭" position={[-2.5, 1.5, -1]} speed={0.8} />
        <FloatingEmoji emoji="🤡" position={[2.5, -1, -1]} speed={1.2} />
        <FloatingEmoji emoji="😂" position={[-1.5, -1.5, 0.5]} speed={0.6} />
        <FloatingEmoji emoji="🎪" position={[1.8, 1.8, -0.5]} speed={1} />
        <FloatingEmoji emoji="🃏" position={[0, 2.5, -2]} speed={0.9} />

        <Sparkles
          count={120}
          scale={10}
          size={1.5}
          speed={0.2}
          opacity={0.3}
          color="#00ffff"
        />
      </Canvas>
    </div>
  );
}
