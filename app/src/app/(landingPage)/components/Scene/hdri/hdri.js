import * as THREE from "three";

export function createHDRI() {
  const scene = new THREE.Scene();

  const skyGeometry = new THREE.SphereGeometry(30, 64, 64);
  const skyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      // Black-dominant grayscale palette.
      topColor: { value: new THREE.Color(0x686868) },
      horizonColor: { value: new THREE.Color(0x2a2a2a) },
      bottomColor: { value: new THREE.Color(0x080808) },
    },
    vertexShader: `
      varying vec3 vWorldPosition;
      void main() {
        vec4 worldPosition = modelMatrix * vec4(position, 1.0);
        vWorldPosition = worldPosition.xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 topColor;
      uniform vec3 horizonColor;
      uniform vec3 bottomColor;
      varying vec3 vWorldPosition;
      float hash(vec3 p) {
        p = fract(p * 0.3183099 + vec3(0.1));
        p *= 17.0;
        return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
      }
      void main() {
        float h = normalize(vWorldPosition).y * 0.5 + 0.5;
        vec3 dir = normalize(vWorldPosition);
        vec3 color = mix(bottomColor, horizonColor, smoothstep(0.02, 0.5, h));
        color = mix(color, topColor, smoothstep(0.5, 1.0, h));

        // Add bright spot clusters for higher-contrast, glacial-feeling highlights.
        float spotA = smoothstep(0.86, 1.0, hash(dir * 18.0));
        float spotB = smoothstep(0.92, 1.0, hash(dir.yzx * 31.0));
        float spotMask = clamp(spotA * 0.7 + spotB * 0.9, 0.0, 1.0);
        float horizonBoost = smoothstep(0.25, 0.9, h);
        color += vec3(0.55) * spotMask * horizonBoost;

        // Slight contrast push while keeping dark dominance.
        color = clamp((color - 0.5) * 1.2 + 0.5, 0.0, 1.0);
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);

  const iceGeo = new THREE.IcosahedronGeometry(1, 1);
  const iceMat = new THREE.MeshStandardMaterial({
    color: 0x7f7f7f,
    metalness: 0,
    roughness: 0.35,
    emissive: 0x0a0a0a,
    emissiveIntensity: 0.08,
  });

  const iceCluster = new THREE.Group();
  const icePositions = [
    [3.2, -0.7, -4.2, 1.2],
    [-4.1, -1.1, -3.6, 1.35],
    [0.8, -1.6, -5.0, 1.6],
    [-2.0, -0.4, 4.1, 1.0],
    [2.8, -1.2, 3.5, 1.25],
    [0.0, -1.9, 2.9, 1.1],
  ];

  for (const [x, y, z, s] of icePositions) {
    const m = new THREE.Mesh(iceGeo, iceMat);
    m.position.set(x, y, z);
    m.scale.setScalar(s);
    m.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    iceCluster.add(m);
  }
  scene.add(iceCluster);

  const envKey = new THREE.DirectionalLight(0xf0f0f0, 3.2);
  envKey.position.set(3, 6, 2);
  scene.add(envKey);

  const envFill = new THREE.HemisphereLight(0x8a8a8a, 0x070707, 0.65);
  scene.add(envFill);

  const dispose = () => {
    sky.geometry.dispose();
    sky.material.dispose();
    iceGeo.dispose();
    iceMat.dispose();
  };

  return { scene, dispose };
}
