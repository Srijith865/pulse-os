import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragmentShader = `
  uniform float u_time;
  varying vec2 vUv;

  // 2D Random
  float random (in vec2 st) {
      return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
  }

  // 2D Noise
  float noise (in vec2 st) {
      vec2 i = floor(st);
      vec2 f = fract(st);
      float a = random(i);
      float b = random(i + vec2(1.0, 0.0));
      float c = random(i + vec2(0.0, 1.0));
      float d = random(i + vec2(1.0, 1.0));
      vec2 u = f*f*(3.0-2.0*f);
      return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  #define OCTAVES 4
  float fbm (in vec2 st) {
      float value = 0.0;
      float amplitude = .5;
      float frequency = 0.;
      for (int i = 0; i < OCTAVES; i++) {
          value += amplitude * noise(st);
          st *= 2.;
          amplitude *= .5;
      }
      return value;
  }

  void main() {
      vec2 st = gl_FragCoord.xy / 1000.0;
      
      vec2 q = vec2(0.);
      q.x = fbm( st + 0.00*u_time);
      q.y = fbm( st + vec2(1.0));

      vec2 r = vec2(0.);
      r.x = fbm( st + 1.0*q + vec2(1.7,9.2)+ 0.15*u_time );
      r.y = fbm( st + 1.0*q + vec2(8.3,2.8)+ 0.126*u_time);

      float f = fbm(st+r);

      // Pastel colors for Light theme
      vec3 colorA = vec3(0.98, 0.97, 1.0); // very light purple/white
      vec3 colorB = vec3(0.92, 0.90, 1.0); // pale indigo
      vec3 colorC = vec3(0.96, 0.92, 1.0); // pale pinkish purple
      vec3 colorD = vec3(1.0, 1.0, 1.0);   // white

      vec3 color = mix(colorA, colorB, clamp((f*f)*4.0,0.0,1.0));
      color = mix(color, colorC, clamp(length(q),0.0,1.0));
      color = mix(color, colorD, clamp(length(r.x),0.0,1.0));

      gl_FragColor = vec4((f*f*f+.6*f*f+.5*f)*color, 1.0);
  }
`;

function FluidShader() {
  const meshRef = useRef();
  
  const uniforms = {
    u_time: { value: 0 },
  };

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.u_time.value = state.clock.elapsedTime * 0.4;
    }
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function FluidBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas orthographic camera={{ position: [0, 0, 1], zoom: 1 }}>
        <FluidShader />
      </Canvas>
    </div>
  );
}
