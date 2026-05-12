"use client";

import { useState } from "react";

import LandingPageHeader from "./components/LandingPageHeader";
import LandingPageFooter from "./components/LandingPageFooter";
import SceneControls from "./components/SceneControls/SceneControls";

import { createColorHDRI } from "./components/Scene/hdri/hdriColor";
import { createMonoHDRI } from "./components/Scene/hdri/hdriMono";

import styles from "./page.module.css";
import Scene from "./assets/scenes/Scene";
import { AnimatePresence } from "framer-motion";

export default function Home() {
  const [activeSection, setActiveSection] = useState("The Approach");

  const [modelVariant, setModelVariant] = useState("compressed01");
  const [showHDRI, setShowHDRI] = useState(true);
  const [lightsEnabled, setLightsEnabled] = useState(true);

  const hdri = modelVariant === "compressed01" ? createMonoHDRI : createColorHDRI;

  return (
    <main className={styles.page}>
      <LandingPageHeader activeSection={activeSection} />

      <AnimatePresence>
        <Phrase />
        <Scene lightsEnabled={lightsEnabled} showHDRI={showHDRI} createEnvironmentScene={hdri} />
      </AnimatePresence>

      <SceneControls
        modelVariant={modelVariant}
        setModelVariant={setModelVariant}
        showHDRI={showHDRI}
        setShowHDRI={setShowHDRI}
        lightsEnabled={lightsEnabled}
        setLightsEnabled={setLightsEnabled}
      />

      <LandingPageFooter setActiveSection={setActiveSection} />
    </main>
  );
}
