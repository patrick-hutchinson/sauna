import * as THREE from "three";

const MODEL_PROFILES = {
  "/assets/models/13/13.glb": {
    limits: {
      minAzimuth: -Infinity,
      maxAzimuth: Infinity,
      // Lock vertical orbit so dragging only rotates left/right.
      minOrbitY: -20.0,
      maxOrbitY: -20.0,
    },
    initial: {
      azimuth: -73.7,
      orbitY: -20.0,
    },
  },
  "/assets/models/01/01.glb": {
    limits: {
      minAzimuth: -50,
      maxAzimuth: 50,
      minOrbitY: -50,
      maxOrbitY: 50,
    },
  },
  "/assets/models/14/14.glb": {
    limits: {
      minAzimuth: 24.1,
      maxAzimuth: 138.3,
      minOrbitY: -57.9,
      maxOrbitY: 36.5,
    },
    initial: {
      azimuth: 81.2,
      orbitY: -10.7,
    },
  },
  "/assets/models/16/16.glb": {
    limits: {
      minAzimuth: -77.2,
      maxAzimuth: -19.3,
      minOrbitY: -36.5,
      maxOrbitY: 25.6,
    },
    initial: {
      azimuth: -48.25,
      orbitY: -5.45,
    },
  },
};

const DEFAULTS = {
  rotateSpeed: 1,
  baseDamping: 0.08,
  edgeDamping: 0.08,
};

function orbitYToPolar(orbitYDeg) {
  return THREE.MathUtils.degToRad(90 + orbitYDeg);
}

export function getModelOrbitProfile(modelPath) {
  return MODEL_PROFILES[modelPath] ?? null;
}

export function applyOrbitControlsProfile(controls, modelPath) {
  const profile = getModelOrbitProfile(modelPath);

  controls.enableDamping = true;
  controls.enableZoom = true;
  controls.enablePan = true;
  controls.rotateSpeed = DEFAULTS.rotateSpeed;
  controls.dampingFactor = DEFAULTS.baseDamping;

  if (!profile) {
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    return null;
  }

  if (!profile.limits) {
    controls.minAzimuthAngle = -Infinity;
    controls.maxAzimuthAngle = Infinity;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    return {
      ...DEFAULTS,
      limits: null,
      initial: profile.initial ?? null,
    };
  }

  controls.minAzimuthAngle = THREE.MathUtils.degToRad(profile.limits.minAzimuth);
  controls.maxAzimuthAngle = THREE.MathUtils.degToRad(profile.limits.maxAzimuth);
  controls.minPolarAngle = orbitYToPolar(profile.limits.minOrbitY);
  controls.maxPolarAngle = orbitYToPolar(profile.limits.maxOrbitY);

  return {
    ...DEFAULTS,
    limits: profile.limits,
    initial: profile.initial ?? null,
  };
}

export function applyInitialOrbitAngles(controls, profileState) {
  if (!profileState?.initial) return;
  controls.setAzimuthalAngle(THREE.MathUtils.degToRad(profileState.initial.azimuth));
  controls.setPolarAngle(orbitYToPolar(profileState.initial.orbitY));
  controls.update();
}

export function updateOrbitEdgeSmoothing(controls, profileState) {
  if (!profileState?.limits) return;
  // Keep interaction uniformly heavy across the entire allowed range.
  controls.rotateSpeed = profileState.rotateSpeed;
  controls.dampingFactor = profileState.baseDamping;
}
