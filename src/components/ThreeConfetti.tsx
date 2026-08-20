"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function PhysicsConfetti() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const count = 1000;
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const colors = ["#F2C4CE", "#FFFFFF", "#D4A853", "#C8B8DA"]; // pink, white, gold, lilac

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      temp.push({
        position: [
          (Math.random() - 0.5) * 60, 
          Math.random() * 40 + 10, // Start high
          (Math.random() - 0.5) * 20 - 5
        ],
        velocity: [
          (Math.random() - 0.5) * 0.1,
          -Math.random() * 0.1 - 0.05, // Falling speed
          (Math.random() - 0.5) * 0.1
        ],
        rotation: [Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI],
        rotSpeed: [Math.random() * 0.1, Math.random() * 0.1, Math.random() * 0.1],
        color: new THREE.Color(colors[Math.floor(Math.random() * colors.length)])
      });
    }
    return temp;
  }, [count, colors]);

  const colorArray = useMemo(() => {
    const arr = new Float32Array(count * 3);
    particles.forEach((p, i) => {
      p.color.toArray(arr, i * 3);
    });
    return arr;
  }, [particles, count]);

  useFrame(() => {
    if (meshRef.current) {
      particles.forEach((particle, i) => {
        // Physics update
        particle.position[0] += particle.velocity[0];
        particle.position[1] += particle.velocity[1];
        particle.position[2] += particle.velocity[2];
        
        particle.rotation[0] += particle.rotSpeed[0];
        particle.rotation[1] += particle.rotSpeed[1];
        particle.rotation[2] += particle.rotSpeed[2];

        // Slight drag and wind
        particle.velocity[0] += (Math.random() - 0.5) * 0.01;
        
        // Reset if it falls below screen to loop (or we could just let them fall)
        if (particle.position[1] < -30) {
          particle.position[1] = 30;
          particle.position[0] = (Math.random() - 0.5) * 60;
          particle.velocity[1] = -Math.random() * 0.1 - 0.05;
        }

        dummy.position.set(particle.position[0], particle.position[1], particle.position[2]);
        dummy.rotation.set(particle.rotation[0], particle.rotation[1], particle.rotation[2]);
        dummy.updateMatrix();
        meshRef.current?.setMatrixAt(i, dummy.matrix);
      });
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <planeGeometry args={[0.3, 0.15]} />
      <meshBasicMaterial side={THREE.DoubleSide} vertexColors />
      <instancedBufferAttribute attach="instanceColor" args={[colorArray, 3]} />
    </instancedMesh>
  );
}

function CameraZoom() {
  const { camera } = useThree();
  
  useFrame(() => {
    // Zoom in slowly over time by reducing FOV
    if ((camera as THREE.PerspectiveCamera).fov > 30) {
      (camera as THREE.PerspectiveCamera).fov -= 0.05;
      camera.updateProjectionMatrix();
    }
  });

  return null;
}

export default function ThreeConfetti() {
  return (
    <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }}>
      <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
        <CameraZoom />
        <PhysicsConfetti />
      </Canvas>
    </div>
  );
}
