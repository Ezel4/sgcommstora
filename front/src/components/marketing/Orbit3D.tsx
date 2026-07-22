"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Sparkles } from "@react-three/drei";
import * as THREE from "three";

const ROSE = "#1fc5be";

/* Logos (simple-icons) + vraies couleurs de marque ------------------------- */
const BRANDS: { label: string; color: string; path: string }[] = [
  {
    label: "Stripe",
    color: "#635BFF",
    path: "M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.975 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.545-2.354 1.545-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.594-7.305h.003z",
  },
  {
    label: "Cloudflare",
    color: "#F38020",
    path: "M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1601-.8868 2.5537-1.9136l.499-1.3013c.0215-.0561.0293-.1128.0147-.168-.5625-2.5463-2.835-4.4453-5.5499-4.4453-2.5039 0-4.6284 1.6177-5.3876 3.8614-.4927-.3658-1.1187-.5625-1.794-.499-1.2026.119-2.1665 1.083-2.2861 2.2856-.0283.31-.0069.6128.0635.894C1.5683 13.171 0 14.7754 0 16.752c0 .1748.0142.3515.0352.5273.0141.083.0844.1475.1689.1475h15.9814c.0909 0 .1758-.0645.2032-.1553l.12-.4268zm2.7568-5.5634c-.0771 0-.1611 0-.2383.0112-.0566 0-.1054.0415-.127.0976l-.3378 1.1744c-.1475.5068-.0918.9707.1543 1.3164.2256.3164.6055.498 1.0625.5195l1.8437.1133c.0557 0 .1055.0263.1329.0703.0283.043.0351.1074.0214.1562-.0283.084-.1132.1485-.204.1553l-1.921.1123c-1.041.0488-2.1582.8867-2.5527 1.914l-.1406.3585c-.0283.0713.0215.1416.0986.1416h6.5977c.0771 0 .1474-.0489.169-.126.1122-.4082.1757-.837.1757-1.2803 0-2.6025-2.125-4.727-4.7344-4.727",
  },
  {
    label: "Supabase",
    color: "#3FCF8E",
    path: "M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z",
  },
  {
    label: "Clerk",
    color: "#6C47FF",
    path: "m21.47 20.829-2.881-2.881a.572.572 0 0 0-.7-.084 6.854 6.854 0 0 1-7.081 0 .576.576 0 0 0-.7.084l-2.881 2.881a.576.576 0 0 0-.103.69.57.57 0 0 0 .166.186 12 12 0 0 0 14.113 0 .58.58 0 0 0 .239-.423.576.576 0 0 0-.172-.453Zm.002-17.668-2.88 2.88a.569.569 0 0 1-.701.084A6.857 6.857 0 0 0 8.724 8.08a6.862 6.862 0 0 0-1.222 3.692 6.86 6.86 0 0 0 .978 3.764.573.573 0 0 1-.083.699l-2.881 2.88a.567.567 0 0 1-.864-.063A11.993 11.993 0 0 1 6.771 2.7a11.99 11.99 0 0 1 14.637-.405.566.566 0 0 1 .232.418.57.57 0 0 1-.168.448Zm-7.118 12.261a3.427 3.427 0 1 0 0-6.854 3.427 3.427 0 0 0 0 6.854Z",
  },
  {
    label: "Google Gemini",
    color: "#8E75B2",
    path: "M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81",
  },
  {
    label: "Anthropic",
    color: "#D97757",
    path: "M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z",
  },
  {
    label: "Meta",
    color: "#0467DF",
    path: "M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z",
  },
  {
    label: "Figma",
    color: "#F24E1E",
    path: "M15.852 8.981h-4.588V0h4.588c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.491-4.49 4.491zM12.735 7.51h3.117c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-3.117V7.51zm0 1.471H8.148c-2.476 0-4.49-2.014-4.49-4.49S5.672 0 8.148 0h4.588v8.981zm-4.587-7.51c-1.665 0-3.019 1.355-3.019 3.019s1.354 3.02 3.019 3.02h3.117V1.471H8.148zm4.587 15.019H8.148c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h4.588v8.98zM8.148 8.981c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h3.117V8.981H8.148zM8.172 24c-2.489 0-4.515-2.014-4.515-4.49s2.014-4.49 4.49-4.49h4.588v4.441c0 2.503-2.047 4.539-4.563 4.539zm-.024-7.51a3.023 3.023 0 0 0-3.019 3.019c0 1.665 1.365 3.019 3.044 3.019 1.705 0 3.093-1.376 3.093-3.068v-2.97H8.148zm7.704 0h-.098c-2.476 0-4.49-2.014-4.49-4.49s2.014-4.49 4.49-4.49h.098c2.476 0 4.49 2.014 4.49 4.49s-2.014 4.49-4.49 4.49zm-.097-7.509c-1.665 0-3.019 1.355-3.019 3.019s1.355 3.019 3.019 3.019h.098c1.665 0 3.019-1.355 3.019-3.019s-1.355-3.019-3.019-3.019h-.098z",
  },
];

const reducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* petit point rond pour le nuage de la planète */
function makeDotTexture() {
  const S = 64;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const ctx = cv.getContext("2d")!;
  const g = ctx.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.5, "rgba(255,255,255,0.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(S / 2, S / 2, S / 2, 0, Math.PI * 2);
  ctx.fill();
  const t = new THREE.CanvasTexture(cv);
  return t;
}

/* pastille blanche + logo en vraie couleur de marque */
function makeChipTexture(path: string, color: string) {
  const S = 320;
  const cv = document.createElement("canvas");
  cv.width = cv.height = S;
  const ctx = cv.getContext("2d")!;
  const c = S / 2;
  const r = S * 0.46;
  const g = ctx.createLinearGradient(0, c - r, 0, c + r);
  g.addColorStop(0, "#ffffff");
  g.addColorStop(1, "#eceef1");
  ctx.beginPath();
  ctx.arc(c, c, r, 0, Math.PI * 2);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.lineWidth = S * 0.01;
  ctx.strokeStyle = "rgba(0,0,0,0.10)";
  ctx.stroke();
  const ls = (S * 0.46) / 24;
  ctx.save();
  ctx.translate(c - 12 * ls, c - 12 * ls);
  ctx.scale(ls, ls);
  ctx.fillStyle = color;
  ctx.fill(new Path2D(path));
  ctx.restore();
  const t = new THREE.CanvasTexture(cv);
  t.anisotropy = 8;
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function fibonacciSphere(n: number, radius: number) {
  const pts = new Float32Array(n * 3);
  const off = 2 / n;
  const inc = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = i * off - 1 + off / 2;
    const rad = Math.sqrt(Math.max(0, 1 - y * y));
    const phi = i * inc;
    pts[i * 3] = Math.cos(phi) * rad * radius;
    pts[i * 3 + 1] = y * radius;
    pts[i * 3 + 2] = Math.sin(phi) * rad * radius;
  }
  return pts;
}

function Planet() {
  const spin = useRef<THREE.Group>(null);
  const dotTex = useMemo(() => makeDotTexture(), []);
  const positions = useMemo(() => fibonacciSphere(820, 1.08), []);
  useFrame((_, d) => {
    if (spin.current && !reducedMotion()) spin.current.rotation.y += d * 0.1;
  });
  return (
    <group ref={spin}>
      {/* nuage de points (pointillé) */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.055}
          map={dotTex}
          color="#f6f0e7"
          transparent
          alphaTest={0.4}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
      {/* corps sombre (cache les points du fond, donne le volume) */}
      <mesh>
        <sphereGeometry args={[1.0, 48, 48]} />
        <meshStandardMaterial color="#15141a" roughness={0.9} metalness={0.05} />
      </mesh>
    </group>
  );
}

function Satellites() {
  const grp = useRef<THREE.Group>(null);
  const texes = useMemo(() => BRANDS.map((b) => makeChipTexture(b.path, b.color)), []);
  // logos répartis tout autour de la planète (coquille sphérique)
  const positions = useMemo(() => fibonacciSphere(BRANDS.length, 1.95), []);
  useFrame((_, d) => {
    if (grp.current && !reducedMotion()) grp.current.rotation.y += d * 0.12;
  });
  return (
    <group ref={grp} rotation={[0.42, 0, 0.18]}>
      {BRANDS.map((b, i) => (
        <group key={b.label} position={[positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]]}>
          <Billboard>
            <mesh>
              <planeGeometry args={[0.56, 0.56]} />
              <meshBasicMaterial map={texes[i]} transparent alphaTest={0.5} />
            </mesh>
          </Billboard>
        </group>
      ))}
    </group>
  );
}

function Scene() {
  const par = useRef<THREE.Group>(null);
  useFrame((s) => {
    if (par.current && !reducedMotion()) {
      par.current.rotation.x = THREE.MathUtils.lerp(par.current.rotation.x, 0.12 - s.pointer.y * 0.5, 0.06);
      par.current.rotation.y = THREE.MathUtils.lerp(par.current.rotation.y, s.pointer.x * 0.7, 0.06);
    }
  });
  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 4, 5]} intensity={2.4} color="#ffe7d6" />
      <pointLight position={[-3, -1, 2]} intensity={2} color={ROSE} distance={12} />

      <group ref={par}>
        <Planet />
        <Satellites />
      </group>

      <Sparkles count={36} scale={11} size={1.6} speed={0.2} opacity={0.4} color="#f4d9c8" />
    </>
  );
}

export default function Orbit3D() {
  const ref = useRef<HTMLDivElement>(null);
  // ne rend la scene QUE lorsqu'elle est visible a l'ecran (gros gain perf)
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      const frame = window.requestAnimationFrame(() => setActive(true));
      return () => window.cancelAnimationFrame(frame);
    }
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "150px 0px" },
    );
    io.observe(el);
    // si l'onglet passe en arriere-plan, on coupe aussi
    const onVis = () => {
      if (document.hidden) setActive(false);
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <Canvas
        frameloop={active ? "always" : "never"}
        camera={{ position: [0, 0, 8], fov: 36 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent" }}
      >
        <Scene />
      </Canvas>
    </div>
  );
}
