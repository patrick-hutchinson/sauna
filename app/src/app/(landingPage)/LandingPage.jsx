"use client";

import { useState } from "react";

import LandingPageHeader from "./components/LandingPageHeader";
import LandingPageFooter from "./components/LandingPageFooter";
import SceneControls from "./components/SceneControls/SceneControls";

import { createColorHDRI } from "./components/Scene/hdri/hdriColor";
import { createMonoHDRI } from "./components/Scene/hdri/hdriMono";

import styles from "./page.module.css";
import Scene from "./components/Scene/Scene";
import { AnimatePresence } from "framer-motion";

import Text from "@/components/Text/Text";

const LandingPage = ({ page }) => {
  const [view, setView] = useState("model");
  const [activeSection, setActiveSection] = useState("The Approach");

  const [modelVariant, setModelVariant] = useState("compressed01");
  const [showHDRI, setShowHDRI] = useState(true);
  const [lightsEnabled, setLightsEnabled] = useState(true);

  const hdri = modelVariant === "compressed01" ? createMonoHDRI : createColorHDRI;

  return (
    <main className={styles.page}>
      <LandingPageHeader activeSection={activeSection} />

      <AnimatePresence>
        {view === "text" ? (
          <Text text={activeSection.sectionText} className={styles.sectionText} typo="h3" />
        ) : (
          <Scene lightsEnabled={lightsEnabled} showHDRI={showHDRI} createEnvironmentScene={hdri} />
        )}
      </AnimatePresence>

      <SceneControls
        modelVariant={modelVariant}
        setModelVariant={setModelVariant}
        showHDRI={showHDRI}
        setShowHDRI={setShowHDRI}
        lightsEnabled={lightsEnabled}
        setLightsEnabled={setLightsEnabled}
      />

      <LandingPageFooter page={page} setActiveSection={setActiveSection} setView={setView} />
    </main>
  );
};

export default LandingPage;
