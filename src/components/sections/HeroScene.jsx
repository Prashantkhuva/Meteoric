"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
} from "@react-three/postprocessing";
import * as THREE from "three";

const STAR_COUNT = 500;
const DUST_COUNT = 150;
const METEOR_COUNT = 4;
const METEOR_TRAIL = 24;
const METEOR_DISTANCE = 26;
const METEOR_SPACING = 0.32;

function mulberry32(seed) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function createEarthTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext("2d");
  const rnd = mulberry32(42);

  ctx.fillStyle = "#13233f";
  ctx.fillRect(0, 0, 1024, 512);

  for (let b = 0; b < 10; b++) {
    const cx = rnd() * 1024;
    const cy = 70 + rnd() * 370;
    const base = 34 + rnd() * 95;
    const pts = [];
    for (let k = 0; k < 16; k++) {
      const a = (k / 16) * Math.PI * 2;
      const r = base * (0.55 + rnd() * 0.7);
      pts.push([cx + Math.cos(a) * r * 1.35, cy + Math.sin(a) * r]);
    }
    ctx.fillStyle = b % 3 === 0 ? "#1a3150" : "#1e3a5f";
    ctx.beginPath();
    ctx.moveTo((pts[15][0] + pts[0][0]) / 2, (pts[15][1] + pts[0][1]) / 2);
    for (let k = 0; k < 16; k++) {
      const p = pts[k];
      const n = pts[(k + 1) % 16];
      ctx.quadraticCurveTo(
        p[0],
        p[1],
        (p[0] + n[0]) / 2,
        (p[1] + n[1]) / 2,
      );
    }
    ctx.closePath();
    ctx.fill();
  }

  const img = ctx.getImageData(0, 0, 1024, 512);
  let lights = 0;
  let tries = 0;
  while (lights < 260 && tries < 3000) {
    tries++;
    const x = Math.floor(rnd() * 1024);
    const y = Math.floor(rnd() * 512);
    const r = img.data[(y * 1024 + x) * 4];
    if (r < 25) continue;
    lights++;
    ctx.fillStyle = `rgba(255, 214, 160, ${0.18 + rnd() * 0.55})`;
    ctx.beginPath();
    ctx.arc(x, y, 0.5 + rnd() * 1.3, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

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

function Planet({ reduced }) {
  const groupRef = useRef();
  const atmosphereRef = useRef();
  const earthTex = useMemo(() => createEarthTexture(), []);

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

  useEffect(() => () => earthTex.dispose(), [earthTex]);

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (groupRef.current) groupRef.current.rotation.y = t * 0.06;
    if (atmosphereRef.current) atmosphereRef.current.rotation.y = -t * 0.04;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.3}>
      <group ref={groupRef}>
        <mesh geometry={planetGeo}>
          <meshStandardMaterial
            map={earthTex}
            emissiveMap={earthTex}
            emissive="#ffffff"
            emissiveIntensity={0.2}
            roughness={0.9}
            metalness={0}
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

function createCircleGeometry(radius, axis, angle) {
  const pts = [];
  const v3 = new THREE.Vector3();
  const rotAxis = new THREE.Vector3(...axis);
  for (let i = 0; i <= 128; i++) {
    const a = (i / 128) * Math.PI * 2;
    v3.set(Math.cos(a) * radius, Math.sin(a) * radius, 0);
    v3.applyAxisAngle(rotAxis, angle);
    pts.push(v3.clone());
  }
  return new THREE.BufferGeometry().setFromPoints(pts);
}

function OrbitalRings({ reduced }) {
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  const ring1Geo = useMemo(
    () => createCircleGeometry(3.8, [1, 0, 0], Math.PI * 0.3),
    [],
  );
  const ring2Geo = useMemo(
    () => createCircleGeometry(4.5, [0.5, 1, 0], Math.PI * 0.55),
    [],
  );

  useEffect(
    () => () => {
      ring1Geo.dispose();
      ring2Geo.dispose();
    },
    [ring1Geo, ring2Geo],
  );

  useFrame((state) => {
    if (reduced) return;
    const t = state.clock.elapsedTime;
    if (ring1Ref.current) ring1Ref.current.rotation.z = t * 0.02;
    if (ring2Ref.current) ring2Ref.current.rotation.z = -t * 0.015;
  });

  return (
    <>
      <lineLoop ref={ring1Ref} geometry={ring1Geo}>
        <lineBasicMaterial
          color="#6688cc"
          transparent
          opacity={0.35}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineLoop>
      <lineLoop ref={ring2Ref} geometry={ring2Geo}>
        <lineBasicMaterial
          color="#7799dd"
          transparent
          opacity={0.22}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineLoop>
    </>
  );
}

function createMeteorBuffers() {
  return Array.from({ length: METEOR_COUNT }, () => ({
    trail: new Float32Array(METEOR_TRAIL * 3),
    head: new Float32Array(3),
  }));
}

function createMeteorSim() {
  return Array.from({ length: METEOR_COUNT }, (_, i) => ({
    active: false,
    t: 0,
    dur: 1,
    delay: i * 0.9 + Math.random() * 2,
    from: new THREE.Vector3(),
    dir: new THREE.Vector3(),
  }));
}

function createGlowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.3, "rgba(234,243,255,0.85)");
  g.addColorStop(1, "rgba(190,215,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Meteors() {
  const [buffers] = useState(createMeteorBuffers);
  const glowTex = useMemo(() => createGlowTexture(), []);
  const simRef = useRef(createMeteorSim());
  const lineRefs = useRef([]);
  const headRefs = useRef([]);

  useEffect(() => () => glowTex.dispose(), [glowTex]);

  useFrame((_, delta) => {
    const dt = Math.min(delta, 0.05);
    for (let i = 0; i < simRef.current.length; i++) {
      const m = simRef.current[i];
      const line = lineRefs.current[i];
      const head = headRefs.current[i];
      if (!line || !head) continue;

      if (!m.active) {
        m.delay -= dt;
        if (m.delay > 0) {
          line.material.opacity = 0;
          head.material.opacity = 0;
          continue;
        }
        m.active = true;
        m.t = 0;
        m.dur = 1.6 + Math.random() * 1.4;
        const fromLeft = Math.random() > 0.5;
        const z = -2 + Math.random() * 3;
        m.from.set(
          fromLeft ? -1.5 - Math.random() * 2 : 1.5 + Math.random() * 2,
          3.5 + Math.random() * 2,
          z,
        );
        m.dir
          .set((fromLeft ? 1 : -1) * (0.35 + Math.random() * 0.3), -1, 0)
          .normalize();
      }

      m.t += dt / m.dur;
      if (m.t >= 1) {
        m.active = false;
        m.delay = 1 + Math.random() * 3.5;
        line.material.opacity = 0;
        head.material.opacity = 0;
        continue;
      }

      const ease = m.t * m.t * (3 - 2 * m.t);
      const dist = METEOR_DISTANCE * ease;
      const hx = m.from.x + m.dir.x * dist;
      const hy = m.from.y + m.dir.y * dist;
      const hz = m.from.z + m.dir.z * dist;
      const headArr = head.geometry.attributes.position.array;
      const trailArr = line.geometry.attributes.position.array;
      headArr[0] = hx;
      headArr[1] = hy;
      headArr[2] = hz;

      for (let j = 0; j < METEOR_TRAIL; j++) {
        const back = j * METEOR_SPACING;
        trailArr[j * 3] = hx - m.dir.x * back;
        trailArr[j * 3 + 1] = hy - m.dir.y * back;
        trailArr[j * 3 + 2] = hz - m.dir.z * back;
      }

      const fade = Math.sin(Math.PI * m.t);
      line.material.opacity = fade;
      head.material.opacity = Math.min(1, fade * 2.2);
      line.geometry.attributes.position.needsUpdate = true;
      head.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <group>
      {buffers.map((b, i) => (
        <group key={i}>
          <line
            ref={(el) => {
              lineRefs.current[i] = el;
            }}
          >
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={METEOR_TRAIL}
                array={b.trail}
                itemSize={3}
              />
            </bufferGeometry>
            <lineBasicMaterial
              color="#b9d4ff"
              transparent
              opacity={0}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </line>
          <points
            ref={(el) => {
              headRefs.current[i] = el;
            }}
          >
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                count={1}
                array={b.head}
                itemSize={3}
              />
            </bufferGeometry>
            <pointsMaterial
              size={0.45}
              map={glowTex}
              color="#eaf3ff"
              transparent
              opacity={0}
              sizeAttenuation
              blending={THREE.AdditiveBlending}
              depthWrite={false}
            />
          </points>
        </group>
      ))}
    </group>
  );
}

function CameraParallax({ mouse, reduced, baseY }) {
  useFrame((state) => {
    if (reduced) return;
    const next = state.camera.position;
    next.x += (mouse.current.x * 0.4 - next.x) * 0.04;
    next.y += (baseY + mouse.current.y * 0.25 - next.y) * 0.04;
  });

  return null;
}

function Scene({ mouse, reduced, baseY }) {
  return (
    <>
      <color attach="background" args={["#010405"]} />
      <fog attach="fog" args={["#010405", 10, 35]} />
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 3, 5]} intensity={1.1} color="#99aacc" />
      <pointLight
        position={[-3, 2, 4]}
        intensity={0.8}
        color="#4466aa"
        distance={15}
      />
      <StarField />
      <SpaceDust mouse={mouse} />
      <Planet reduced={reduced} />
      <OrbitalRings reduced={reduced} />
      {!reduced && <Meteors />}
      <CameraParallax mouse={mouse} reduced={reduced} baseY={baseY} />
      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.15}
          luminanceSmoothing={0.9}
          mipmapBlur
        />
        <Vignette eskil={false} offset={0.15} darkness={0.85} />
      </EffectComposer>
    </>
  );
}

export default function HeroScene() {
  const mouseRef = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [reduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );

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

  const baseY = isMobile ? 2.1 : 0;

  return (
    <div className="absolute inset-0">
      <Canvas
        dpr={[1, 2]}
        camera={{
          position: [0, baseY, isMobile ? 17 : 6],
          rotation: [0, 0, 0],
          fov: isMobile ? 50 : 55,
        }}
        gl={{ alpha: true, antialias: true }}
        style={{ background: "transparent" }}
        frameloop={reduced ? "demand" : "always"}
      >
        <Scene mouse={mouseRef} reduced={reduced} baseY={baseY} />
      </Canvas>
    </div>
  );
}
