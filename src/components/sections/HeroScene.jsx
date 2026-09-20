"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";

const STAR_COUNT = 500;
const DUST_COUNT = 150;

function createStarPositions() {
  const arr = new Float32Array(STAR_COUNT * 3);
  for (let i = 0; i < STAR_COUNT; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 12 + Math.random() * 30;
    arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    arr[i * 3 + 2] = r * Math.cos(phi);
  }
  return arr;
}

function StarField() {
  const ref = useRef();
  const [positions] = useState(createStarPositions);

  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y = state.clock.elapsedTime * 0.003;
      ref.current.rotation.x = state.clock.elapsedTime * 0.001;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={STAR_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.04}
        color="#ffffff"
        transparent
        opacity={0.9}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

function createDustData() {
  const arr = new Float32Array(DUST_COUNT * 3);
  const vel = new Float32Array(DUST_COUNT * 3);
  for (let i = 0; i < DUST_COUNT; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 20;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 12;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 10;
    vel[i * 3] = (Math.random() - 0.5) * 0.004;
    vel[i * 3 + 1] = (Math.random() - 0.5) * 0.003;
    vel[i * 3 + 2] = (Math.random() - 0.5) * 0.002;
  }
  return { positions: arr, velocities: vel };
}

function SpaceDust({ mouse }) {
  const ref = useRef();
  const [{ positions }] = useState(createDustData);
  const velocityRef = useRef(createDustData().velocities);

  useFrame((state) => {
    if (!ref.current) return;
    const posArr = ref.current.geometry.attributes.position.array;
    const vel = velocityRef.current;
    const time = state.clock.elapsedTime;

    for (let i = 0; i < DUST_COUNT; i++) {
      posArr[i * 3] += vel[i * 3];
      posArr[i * 3 + 1] += vel[i * 3 + 1] + Math.sin(time * 0.4 + i) * 0.0008;
      posArr[i * 3 + 2] += vel[i * 3 + 2];

      if (Math.abs(posArr[i * 3]) > 10) vel[i * 3] *= -1;
      if (Math.abs(posArr[i * 3 + 1]) > 6) vel[i * 3 + 1] *= -1;
      if (Math.abs(posArr[i * 3 + 2]) > 5) vel[i * 3 + 2] *= -1;
    }
    ref.current.geometry.attributes.position.needsUpdate = true;

    const targetX = mouse.current.x * 0.3;
    const targetY = mouse.current.y * 0.2;
    ref.current.rotation.y += (targetX * 0.05 - ref.current.rotation.y) * 0.01;
    ref.current.rotation.x += (targetY * 0.03 - ref.current.rotation.x) * 0.01;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={DUST_COUNT}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.025}
        color="#7799cc"
        transparent
        opacity={0.6}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function Planet() {
  const groupRef = useRef();
  const atmosphereRef = useRef();

  const planetGeo = useMemo(() => new THREE.SphereGeometry(1.8, 64, 64), []);
  const ringGeo = useMemo(() => {
    const geo = new THREE.RingGeometry(2.4, 3.6, 128);
    const pos = geo.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      v3.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 0.45);
      pos.setXYZ(i, v3.x, v3.y, v3.z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.06;
    if (atmosphereRef.current) atmosphereRef.current.rotation.y = -t * 0.04;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.3}>
      <group ref={groupRef}>
        <mesh geometry={planetGeo}>
          <meshBasicMaterial
            color="#1a2a4a"
          />
        </mesh>
        <mesh geometry={ringGeo}>
          <meshBasicMaterial
            color="#4466aa"
            transparent
            opacity={0.25}
            side={THREE.DoubleSide}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      </group>
      <group ref={atmosphereRef}>
        <mesh>
          <sphereGeometry args={[1.95, 64, 64]} />
          <meshBasicMaterial
            color="#3366cc"
            transparent
            opacity={0.06}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      </group>
    </Float>
  );
}

function OrbitalRings() {
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  const ring1Geo = useMemo(() => {
    const geo = new THREE.RingGeometry(3.8, 3.85, 128);
    const pos = geo.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      v3.applyAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI * 0.3);
      pos.setXYZ(i, v3.x, v3.y, v3.z);
    }
    pos.needsUpdate = true;
    return geo;
  }, []);

  const ring2Geo = useMemo(() => {
    const geo = new THREE.RingGeometry(4.5, 4.53, 128);
    const pos = geo.attributes.position;
    const v3 = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v3.fromBufferAttribute(pos, i);
      v3.applyAxisAngle(new THREE.Vector3(0.5, 1, 0), Math.PI * 0.55);
      pos.setXYZ(i, v3.x, v3.y, v3.z);
    }
    pos.needsUpdate = true;
    return geo;
  }, []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.02;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.015;
  });

  return (
    <>
      <mesh ref={ring1Ref} geometry={ring1Geo}>
        <lineBasicMaterial
          color="#5577bb"
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
      <mesh ref={ring2Ref} geometry={ring2Geo}>
        <lineBasicMaterial
          color="#6688cc"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </>
  );
}

function Scene({ mouse, isMobile }) {
  const { invalidate } = useThree();

  useEffect(() => {
    const onMove = () => invalidate();
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [invalidate]);

  return (
    <>
      <color attach="background" args={["#010405"]} />
      <fog attach="fog" args={["#010405", 10, 35]} />
      <ambientLight intensity={0.15} />
      <directionalLight position={[5, 3, 5]} intensity={0.4} color="#8899cc" />
      <pointLight position={[-3, 2, 4]} intensity={0.6} color="#4466aa" distance={15} />
      <StarField />
      <SpaceDust mouse={mouse} />
      <Planet />
      <OrbitalRings />
      <EffectComposer>
        <Bloom intensity={0.5} luminanceThreshold={0.15} luminanceSmoothing={0.9} mipmapBlur />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

export default function HeroScene() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const handleMouse = (e) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouse);
    return () => window.removeEventListener("mousemove", handleMouse);
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, isMobile ? 8 : 6], fov: isMobile ? 50 : 55 }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        frameloop="demand"
      >
        <Scene mouse={mouseRef} isMobile={isMobile} />
      </Canvas>
    </div>
  );
}
