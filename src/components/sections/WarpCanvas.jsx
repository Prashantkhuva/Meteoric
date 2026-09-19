"use client";

import { useEffect, useRef, useCallback } from "react";

const DPR_CAP = 2;
const STAR_COUNT = 200;

const VERT = `
  attribute vec3 a_position;
  attribute float a_speed;
  attribute float a_brightness;
  uniform float u_time;
  uniform float u_scroll;
  uniform float u_mouseX;
  uniform float u_mouseY;
  uniform vec2 u_resolution;
  varying float v_brightness;
  varying float v_depth;

  void main() {
    vec3 pos = a_position;

    float warp = 1.0 + u_scroll * 4.0;
    pos.z += u_time * a_speed * 0.15 * warp;

    float tunnel = 3.0;
    vec2 uv = pos.xy / (pos.z + tunnel);

    uv.x += u_mouseX * 0.03;
    uv.y += u_mouseY * 0.02;

    gl_Position = vec4(uv, 0.0, 1.0);

    float dist = length(pos.xy);
    float size = (1.0 / (pos.z + tunnel)) * 180.0;
    size *= 1.0 + u_scroll * 0.6;
    gl_PointSize = max(1.0, size);

    float alpha = smoothstep(0.0, 0.3, 1.0 / (pos.z + tunnel));
    v_brightness = a_brightness * alpha;
    v_depth = pos.z;
  }
`;

const FRAG = `
  precision mediump float;
  varying float v_brightness;
  varying float v_depth;
  uniform float u_scroll;

  void main() {
    vec2 center = gl_PointCoord - 0.5;
    float dist = length(center);

    float core = smoothstep(0.5, 0.0, dist);
    float glow = smoothstep(0.5, 0.08, dist) * 0.6;
    float streak = 0.0;
    if (abs(center.y) < 0.12 && abs(center.x) < 0.45) {
      streak = smoothstep(0.45, 0.0, abs(center.x)) * 0.3;
    }
    float alpha = (core + glow + streak) * v_brightness;

    float warmth = mix(0.85, 1.0, v_brightness);
    vec3 color = vec3(warmth, warmth, 1.0);

    gl_FragColor = vec4(color, alpha);
  }
`;

function createShader(gl, type, source) {
  const s = gl.createShader(type);
  gl.shaderSource(s, source);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(s));
    gl.deleteShader(s);
    return null;
  }
  return s;
}

function createProgram(gl, vs, fs) {
  const v = createShader(gl, gl.VERTEX_SHADER, vs);
  const f = createShader(gl, gl.FRAGMENT_SHADER, fs);
  if (!v || !f) return null;
  const p = gl.createProgram();
  gl.attachShader(p, v);
  gl.attachShader(p, f);
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(p));
    return null;
  }
  return p;
}

function createStars(count) {
  const positions = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  const brightness = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const theta = Math.random() * Math.PI * 2;
    const r = Math.random() * 1.8;
    positions[i * 3] = Math.cos(theta) * r;
    positions[i * 3 + 1] = Math.sin(theta) * r;
    positions[i * 3 + 2] = Math.random() * 8;
    speeds[i] = Math.random() * 0.8 + 0.4;
    brightness[i] = Math.random() * 0.6 + 0.4;
  }
  return { positions, speeds, brightness };
}

export default function WarpCanvas({ scrollProgress = 0 }) {
  const canvasRef = useRef(null);
  const glRef = useRef(null);
  const progRef = useRef(null);
  const bufRef = useRef({});
  const uniRef = useRef({});
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const timeRef = useRef(0);
  const isVisibleRef = useRef(true);
  const rafRef = useRef(null);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  const handleMouse = useCallback((e) => {
    mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
    const rect = canvas.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * dpr);
    canvas.height = Math.floor(rect.height * dpr);

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: false,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return;
    glRef.current = gl;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

    const prog = createProgram(gl, VERT, FRAG);
    if (!prog) return;
    progRef.current = prog;

    const starData = createStars(STAR_COUNT);

    const posBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
    gl.bufferData(gl.ARRAY_BUFFER, starData.positions, gl.STATIC_DRAW);

    const spdBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, spdBuf);
    gl.bufferData(gl.ARRAY_BUFFER, starData.speeds, gl.STATIC_DRAW);

    const briBuf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, briBuf);
    gl.bufferData(gl.ARRAY_BUFFER, starData.brightness, gl.STATIC_DRAW);

    bufRef.current = { pos: posBuf, spd: spdBuf, bri: briBuf };

    uniRef.current = {
      u_time: gl.getUniformLocation(prog, "u_time"),
      u_scroll: gl.getUniformLocation(prog, "u_scroll"),
      u_mouseX: gl.getUniformLocation(prog, "u_mouseX"),
      u_mouseY: gl.getUniformLocation(prog, "u_mouseY"),
      u_resolution: gl.getUniformLocation(prog, "u_resolution"),
      a_position: gl.getAttribLocation(prog, "a_position"),
      a_speed: gl.getAttribLocation(prog, "a_speed"),
      a_brightness: gl.getAttribLocation(prog, "a_brightness"),
    };

    const observer = new IntersectionObserver(
      ([entry]) => { isVisibleRef.current = entry.isIntersecting; },
      { threshold: 0 },
    );
    observer.observe(canvas);

    const animate = (ts) => {
      if (!isVisibleRef.current) {
        rafRef.current = requestAnimationFrame(animate);
        return;
      }

      timeRef.current = ts * 0.001;
      const t = timeRef.current;
      const s = scrollRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.012, 0.016, 0.02, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(prog);
      gl.uniform1f(uniRef.current.u_time, t);
      gl.uniform1f(uniRef.current.u_scroll, s);
      gl.uniform1f(uniRef.current.u_mouseX, mx);
      gl.uniform1f(uniRef.current.u_mouseY, my);
      gl.uniform2f(uniRef.current.u_resolution, canvas.width, canvas.height);

      const b = bufRef.current;
      const u = uniRef.current;

      gl.bindBuffer(gl.ARRAY_BUFFER, b.pos);
      gl.enableVertexAttribArray(u.a_position);
      gl.vertexAttribPointer(u.a_position, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, b.spd);
      gl.enableVertexAttribArray(u.a_speed);
      gl.vertexAttribPointer(u.a_speed, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, b.bri);
      gl.enableVertexAttribArray(u.a_brightness);
      gl.vertexAttribPointer(u.a_brightness, 1, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, STAR_COUNT);

      rafRef.current = requestAnimationFrame(animate);
    };

    if (prefersReduced) {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0.012, 0.016, 0.02, 1);
      gl.clear(gl.COLOR_BUFFER_BIT);
    } else {
      rafRef.current = requestAnimationFrame(animate);
    }

    const onResize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = Math.floor(r.width * dpr);
      canvas.height = Math.floor(r.height * dpr);
    };
    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", handleMouse);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", handleMouse);
      observer.disconnect();
    };
  }, [handleMouse]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ display: "block" }}
      aria-hidden="true"
    />
  );
}
