import * as THREE from "three";

export function createColorHDRI() {
  const scene = new THREE.Scene();

  const skyGeometry = new THREE.SphereGeometry(30, 64, 64);
  const skyMaterial = new THREE.ShaderMaterial({
    side: THREE.BackSide,
    uniforms: {
      topColor: { value: new THREE.Color(0xd7ecff) },
      horizonColor: { value: new THREE.Color(0x9cc8ec) },
      bottomColor: { value: new THREE.Color(0x6f9bb8) },
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
      void main() {
        float h = normalize(vWorldPosition).y * 0.5 + 0.5;
        vec3 color = mix(bottomColor, horizonColor, smoothstep(0.0, 0.45, h));
        color = mix(color, topColor, smoothstep(0.45, 1.0, h));
        gl_FragColor = vec4(color, 1.0);
      }
    `,
  });

  const sky = new THREE.Mesh(skyGeometry, skyMaterial);
  scene.add(sky);

  const iceGeo = new THREE.IcosahedronGeometry(1, 1);
  const iceMat = new THREE.MeshStandardMaterial({
    color: 0xe8f6ff,
    metalness: 0,
    roughness: 0.2,
    emissive: 0x0c2233,
    emissiveIntensity: 0.2,
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

  const envKey = new THREE.DirectionalLight(0xe6f5ff, 4.5);
  envKey.position.set(3, 6, 2);
  scene.add(envKey);

  const envFill = new THREE.HemisphereLight(0xd6efff, 0x1f3f54, 1.2);
  scene.add(envFill);

  const dispose = () => {
    sky.geometry.dispose();
    sky.material.dispose();
    iceGeo.dispose();
    iceMat.dispose();
  };

  return { scene, dispose };
}
