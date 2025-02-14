import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial } from "@react-three/drei";

const Bubble = ({ position, scale, speed }) => {
  const bubbleRef = useRef();

  useFrame(() => {
    if (bubbleRef.current) {
      bubbleRef.current.position.y += speed;
      if (bubbleRef.current.position.y > 6) {
        bubbleRef.current.position.y = -6; 
      }
    }
  });

  return (
    <Sphere ref={bubbleRef} position={position} scale={scale}>
      <MeshDistortMaterial
        color="#B0E7FF"
        transparent
        opacity={0.6}
        distort={0.2}
        speed={2}
      />
    </Sphere>
  );
};

const UnderwaterBackground = () => {
  const bubbles = Array.from({ length: 50 }).map(() => ({
    position: [Math.random() * 12 - 6, Math.random() * 12 - 6, Math.random() * -2],
    scale: Math.random() * 0.5 + 0.2,
    speed: Math.random() * 0.02 + 0.01,
  }));

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        zIndex: -1,
        backgroundImage: `url('/blue.jpg')`, 
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
        <ambientLight intensity={0.4} />
        {bubbles.map((bubble, index) => (
          <Bubble key={index} {...bubble} />
        ))}
      </Canvas>
    </div>
  );
};

export default UnderwaterBackground;
