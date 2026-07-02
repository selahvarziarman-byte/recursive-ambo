import { OrbitControls } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { connectionFieldFromRenderState, type ConnectionField } from '../selectors/directorFieldV0';
import { buildKnownSeamRenderState } from '../selectors/witnessBridge';
import type { Vec3 } from '../types/geometry';

const FIELD_TEXTURE_SIZE = 48;
const OCTA_RADIUS = 1;

const VERT = /* glsl */ `
  out vec3 vWorldPos;
  out vec3 vWorldNormal;

  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPos = worldPos.xyz;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;

const FRAG = /* glsl */ `
  precision highp float;
  precision highp sampler3D;

  uniform sampler3D uFieldTex;
  uniform float uTime;
  uniform float uRadius;
  uniform vec3 uInk;
  uniform vec3 uGlow;
  uniform vec3 uDepth;

  in vec3 vWorldPos;
  in vec3 vWorldNormal;
  out vec4 outColor;

  float hash(vec3 p) {
    p = fract(p * 0.3183099 + vec3(0.11, 0.17, 0.23));
    p *= 17.0;
    return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
  }

  float noise(vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    float n000 = hash(i + vec3(0.0, 0.0, 0.0));
    float n100 = hash(i + vec3(1.0, 0.0, 0.0));
    float n010 = hash(i + vec3(0.0, 1.0, 0.0));
    float n110 = hash(i + vec3(1.0, 1.0, 0.0));
    float n001 = hash(i + vec3(0.0, 0.0, 1.0));
    float n101 = hash(i + vec3(1.0, 0.0, 1.0));
    float n011 = hash(i + vec3(0.0, 1.0, 1.0));
    float n111 = hash(i + vec3(1.0, 1.0, 1.0));
    float nx00 = mix(n000, n100, f.x);
    float nx10 = mix(n010, n110, f.x);
    float nx01 = mix(n001, n101, f.x);
    float nx11 = mix(n011, n111, f.x);
    return mix(mix(nx00, nx10, f.y), mix(nx01, nx11, f.y), f.z);
  }

  float fbm(vec3 p) {
    float a = 0.5;
    float s = 0.0;
    for (int i = 0; i < 4; i += 1) {
      s += a * noise(p);
      p = p * 2.03 + vec3(4.7, 1.3, 2.9);
      a *= 0.5;
    }
    return s;
  }

  vec3 fieldDir(vec3 p) {
    vec3 uvw = clamp(p / (2.0 * uRadius) + 0.5, vec3(0.0), vec3(1.0));
    vec3 encoded = texture(uFieldTex, uvw).rgb;
    vec3 d = encoded * 2.0 - 1.0;
    return normalize(d);
  }

  float octaSdf(vec3 p) {
    return (abs(p.x) + abs(p.y) + abs(p.z) - uRadius) * 0.57735026919;
  }

  bool intersectOctahedron(vec3 ro, vec3 rd, out float tNear, out float tFar) {
    tNear = 0.0;
    tFar = 1.0e6;
    for (int xi = 0; xi < 2; xi += 1) {
      for (int yi = 0; yi < 2; yi += 1) {
        for (int zi = 0; zi < 2; zi += 1) {
          vec3 n = vec3(
            xi == 0 ? -1.0 : 1.0,
            yi == 0 ? -1.0 : 1.0,
            zi == 0 ? -1.0 : 1.0
          );
          float denom = dot(n, rd);
          float numer = uRadius - dot(n, ro);
          if (abs(denom) < 1.0e-6) {
            if (numer < 0.0) return false;
          } else {
            float t = numer / denom;
            if (denom < 0.0) {
              tNear = max(tNear, t);
            } else {
              tFar = min(tFar, t);
            }
          }
        }
      }
    }
    return tFar > max(tNear, 0.0);
  }

  float striation(vec3 p, vec3 d) {
    float acc = 0.0;
    float wsum = 0.0;
    float drift = uTime * 0.18;
    for (int i = 0; i < 11; i += 1) {
      float k = float(i) - 5.0;
      float w = 1.0 - abs(k) / 6.0;
      float s = k * 0.07;
      vec3 base = p * 5.4 + d * (s * 5.4);
      float a = fbm(base + d * drift * 5.4);
      float b = fbm(base - d * drift * 5.4);
      acc += 0.5 * w * (a + b);
      wsum += w;
    }
    float lic = acc / max(wsum, 1.0e-5);
    float fine = 0.5 + 0.5 * sin((lic * 5.5 + fbm(p * 2.0) * 1.1 + uTime * 0.08) * 6.28318530718);
    return smoothstep(0.46, 0.78, mix(lic, fine, 0.42));
  }

  void main() {
    vec3 ro = cameraPosition;
    vec3 rd = normalize(vWorldPos - ro);
    float t0;
    float t1;
    if (!intersectOctahedron(ro, rd, t0, t1)) discard;

    t0 = max(t0, 0.0);
    float rayLength = max(t1 - t0, 0.0001);
    vec4 accum = vec4(0.0);

    const int STEPS = 96;
    float dt = rayLength / float(STEPS);
    for (int i = 0; i < STEPS; i += 1) {
      float t = t0 + (float(i) + 0.5) * dt;
      vec3 p = ro + rd * t;
      vec3 d = fieldDir(p);
      vec3 line = abs(d);
      float stripe = striation(p, d);
      float boundary = smoothstep(0.085, 0.0, abs(octaSdf(p)));
      float depth = float(i) / float(STEPS - 1);

      vec3 axisTint = normalize(vec3(0.32, 0.44, 0.58) + line * vec3(0.22, 0.14, 0.10));
      vec3 body = mix(uDepth, uInk, 0.42 + 0.58 * stripe);
      vec3 glow = mix(uGlow, axisTint, 0.35);
      vec3 col = mix(body, glow, stripe * 0.58);
      col += boundary * vec3(0.11, 0.16, 0.20);
      col *= 0.72 + 0.42 * (1.0 - depth);

      float density = 0.018 + stripe * 0.065 + boundary * 0.018;
      float alpha = clamp(density * dt * 22.0, 0.0, 0.09);
      accum.rgb += (1.0 - accum.a) * alpha * col;
      accum.a += (1.0 - accum.a) * alpha;
      if (accum.a > 0.93) break;
    }

    vec3 N = normalize(vWorldNormal);
    float fresnel = pow(1.0 - abs(dot(N, -rd)), 2.2);
    accum.rgb += (1.0 - accum.a) * fresnel * 0.16 * uGlow;
    accum.a = clamp(accum.a + fresnel * 0.08, 0.0, 0.84);
    outColor = vec4(accum.rgb, accum.a);
  }
`;

function normalizeVec(v: Vec3): Vec3 {
  const len = Math.hypot(v[0], v[1], v[2]) || 1;
  return [v[0] / len, v[1] / len, v[2] / len];
}

function dotVec(a: Vec3, b: Vec3): number {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function addVec(a: Vec3, b: Vec3): Vec3 {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function scaleVec(v: Vec3, s: number): Vec3 {
  return [v[0] * s, v[1] * s, v[2] * s];
}

function samplePoint(index: number, size: number, radius: number): number {
  return ((index / (size - 1)) * 2 - 1) * radius;
}

function bakeDirectorTexture(field: ConnectionField, size: number, radius: number): THREE.Data3DTexture {
  const data = new Uint8Array(size * size * size * 4);
  const dirs = new Array<Vec3>(size * size * size);
  const indexOf = (x: number, y: number, z: number): number => x + size * (y + size * z);

  for (let z = 0; z < size; z += 1) {
    for (let y = 0; y < size; y += 1) {
      for (let x = 0; x < size; x += 1) {
        const p: Vec3 = [
          samplePoint(x, size, radius),
          samplePoint(y, size, radius),
          samplePoint(z, size, radius),
        ];
        const i = indexOf(x, y, z);
        let d = normalizeVec(field.sampleDirector(p).director);

        let reference: Vec3 = [0, 0, 0];
        if (x > 0) reference = addVec(reference, dirs[indexOf(x - 1, y, z)]);
        if (y > 0) reference = addVec(reference, dirs[indexOf(x, y - 1, z)]);
        if (z > 0) reference = addVec(reference, dirs[indexOf(x, y, z - 1)]);
        if (dotVec(reference, reference) > 1.0e-8 && dotVec(d, reference) < 0) {
          d = scaleVec(d, -1);
        }
        dirs[i] = d;

        const o = i * 4;
        data[o] = Math.round((d[0] * 0.5 + 0.5) * 255);
        data[o + 1] = Math.round((d[1] * 0.5 + 0.5) * 255);
        data[o + 2] = Math.round((d[2] * 0.5 + 0.5) * 255);
        data[o + 3] = 255;
      }
    }
  }

  const texture = new THREE.Data3DTexture(data, size, size, size);
  texture.format = THREE.RGBAFormat;
  texture.type = THREE.UnsignedByteType;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.wrapR = THREE.ClampToEdgeWrapping;
  texture.unpackAlignment = 1;
  texture.needsUpdate = true;
  return texture;
}

function VolumeField({ field }: { field: ConnectionField }) {
  const resources = useMemo(() => {
    const texture = bakeDirectorTexture(field, FIELD_TEXTURE_SIZE, OCTA_RADIUS);
    const geometry = new THREE.OctahedronGeometry(OCTA_RADIUS, 0);
    const material = new THREE.ShaderMaterial({
      glslVersion: THREE.GLSL3,
      uniforms: {
        uFieldTex: { value: texture },
        uTime: { value: 0 },
        uRadius: { value: OCTA_RADIUS },
        uInk: { value: new THREE.Color('#6ddbd6') },
        uGlow: { value: new THREE.Color('#d8b4fe') },
        uDepth: { value: new THREE.Color('#081225') },
      },
      vertexShader: VERT,
      fragmentShader: FRAG,
      side: THREE.FrontSide,
      transparent: true,
      depthWrite: false,
    });
    return { geometry, material, texture };
  }, [field]);

  useFrame((_, delta) => {
    resources.material.uniforms.uTime.value += delta;
  });

  useEffect(
    () => () => {
      resources.geometry.dispose();
      resources.material.dispose();
      resources.texture.dispose();
    },
    [resources],
  );

  return <mesh geometry={resources.geometry} material={resources.material} />;
}

export function DirectorFieldRenderV0() {
  const field = useMemo(() => connectionFieldFromRenderState(buildKnownSeamRenderState()), []);

  return (
    <div className="h-screen w-screen bg-[#03050a]">
      <Canvas camera={{ position: [2.65, 1.9, 3.1], fov: 42 }} gl={{ antialias: true }}>
        <color attach="background" args={['#03050a']} />
        <VolumeField field={field} />
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          enablePan
          enableRotate
          enableZoom
          minDistance={1.35}
          maxDistance={6}
          autoRotate
          autoRotateSpeed={0.22}
        />
      </Canvas>
    </div>
  );
}
