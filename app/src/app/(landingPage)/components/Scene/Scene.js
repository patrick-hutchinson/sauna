"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { createIceMaterial } from "./materials/iceMaterial";
import { updateMorphTargets } from "./animation/morphLoop";
import { setupIceLighting } from "./lighting/iceLighting";
import { createMaskedCompositeRenderer } from "./render/maskedComposite";
import { frameCameraToModel, getVisibleMeshBounds } from "./utils/modelFraming";
import styles from "../../page.module.css";

import { motion } from "framer-motion";

import Text from "@/components/Text/Text";

export default function Scene({ createEnvironmentScene, lightsEnabled = true, showHDRI, activeSection, setView }) {
  const [status, setStatus] = useState("Loading...");
  const mountRef = useRef(null);
  const showHDRIRef = useRef(showHDRI);

  const handleTextClick = () => {
    setView("text");
  };
  useEffect(() => {
    showHDRIRef.current = showHDRI;
  }, [showHDRI]);

  useEffect(() => {
    if (!mountRef.current) return;

    setStatus?.("Loading model...");

    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x090b0f);

    const renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });
    renderer.autoClear = false;
    renderer.setClearColor(0x000000, 1);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.style.display = "block";
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const arcticEnvironment = createEnvironmentScene();
    const environmentMap = pmremGenerator.fromScene(arcticEnvironment.scene, 0.06).texture;
    scene.environment = environmentMap;
    scene.background = environmentMap;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
    camera.position.set(0, 0, 5);

    const maskedComposite = createMaskedCompositeRenderer();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;

    const { rimLight, rimTarget } = setupIceLighting(scene, lightsEnabled);

    let fittedModelSize = null;
    let fittedModelCenter = new THREE.Vector3();
    let modelRoot = null;
    const morphTargets = [];
    const clock = new THREE.Clock();

    const loader = new GLTFLoader();
    const modelPath = "/assets/models/turbosquid/12/model.glb";

    loader.load(
      modelPath,
      (gltf) => {
        const model = gltf.scene;
        modelRoot = model;
        scene.add(model);

        model.traverse((object) => {
          if (!object.isMesh) return;
          object.castShadow = false;
          object.receiveShadow = false;

          if (Array.isArray(object.material)) {
            object.material = object.material.map((material) => createIceMaterial(material));
          } else {
            object.material = createIceMaterial(object.material);
          }

          if (!object.morphTargetDictionary || !object.morphTargetInfluences) return;
          const indices = Object.entries(object.morphTargetDictionary)
            .sort((a, b) => a[1] - b[1])
            .map((entry) => entry[1]);
          if (indices.length < 2) return;

          object.morphTargetInfluences.fill(0);
          morphTargets.push({
            influences: object.morphTargetInfluences,
            indices,
          });
        });

        const initialBounds = getVisibleMeshBounds(model);
        if (!initialBounds) {
          setStatus?.("Model loaded, but no visible meshes were found.");
          return;
        }

        const size = initialBounds.getSize(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z);
        if (maxAxis > 0) {
          const scale = 2.3 / maxAxis;
          model.scale.setScalar(scale);

          const scaledBounds = getVisibleMeshBounds(model);
          if (!scaledBounds) {
            setStatus?.("Model loaded, but bounds could not be computed.");
            return;
          }

          const scaledCenter = scaledBounds.getCenter(new THREE.Vector3());
          model.position.sub(scaledCenter);

          const centeredBounds = getVisibleMeshBounds(model);
          if (!centeredBounds) {
            setStatus?.("Model loaded, but centered bounds could not be computed.");
            return;
          }

          fittedModelSize = centeredBounds.getSize(new THREE.Vector3());
          fittedModelCenter = centeredBounds.getCenter(new THREE.Vector3());
          frameCameraToModel({
            camera,
            controls,
            rimLight,
            rimTarget,
            size: fittedModelSize,
            center: fittedModelCenter,
          });
        }

        setStatus?.("");
      },
      undefined,
      (error) => {
        console.error(error);
        setStatus?.(`Failed to load ${modelPath}`);
      },
    );

    const resize = () => {
      const { clientWidth, clientHeight } = mount;
      if (!clientWidth || !clientHeight) return;

      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
      maskedComposite.setSize(clientWidth, clientHeight);

      if (fittedModelSize) {
        frameCameraToModel({
          camera,
          controls,
          rimLight,
          rimTarget,
          size: fittedModelSize,
          center: fittedModelCenter,
        });
      }
    };

    resize();
    window.addEventListener("resize", resize);

    let frameId = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      updateMorphTargets(morphTargets, clock.getElapsedTime());

      controls.update();
      if (!showHDRIRef.current && modelRoot) {
        maskedComposite.renderMasked(renderer, scene, camera);
      } else {
        renderer.setRenderTarget(null);
        renderer.clear(true, true, true);
        renderer.render(scene, camera);
      }
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resize);
      controls.dispose();
      environmentMap.dispose();
      pmremGenerator.dispose();
      maskedComposite.dispose();
      renderer.dispose();

      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }

      scene.traverse((object) => {
        if (!object.isMesh) return;
        object.geometry?.dispose();
      });
      arcticEnvironment.dispose();
    };
  }, [createEnvironmentScene, lightsEnabled]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {status ? <p className={styles.status}>{status}</p> : null}
      <Text onClick={handleTextClick} className={`${styles.sectionKey}`} text={activeSection?.sectionKey} />
      <div ref={mountRef} className={styles.canvas} />;
    </motion.div>
  );
}
