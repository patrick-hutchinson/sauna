"use client";

import { useEffect, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";

import { createColorHDRI } from "./components/Scene/hdri/hdriColor";
import { createMonoHDRI } from "./components/Scene/hdri/hdriMono";

import Scene from "./components/Scene/Scene";
import Text from "@/components/Text/Text";

import LandingPageHeader from "./components/LandingPageHeader";
import LandingPageFooter from "./components/LandingPageFooter";
import SceneControls from "./components/SceneControls/SceneControls";

import styles from "./page.module.css";

const LandingPage = ({ page }) => {
  const [view, setView] = useState("text");
  const [activeSection, setActiveSection] = useState();

  const [modelVariant, setModelVariant] = useState("compressed01");
  const [showHDRI, setShowHDRI] = useState(false);
  const [lightsEnabled, setLightsEnabled] = useState(false);

  const hdri = modelVariant === "compressed01" ? createMonoHDRI : createColorHDRI;
  const activeSectionIndex = page?.sections?.findIndex(
    (section) => section.sectionKey === activeSection?.sectionKey,
  );

  if (!page || page.length === 0) return;

  useEffect(() => {
    setActiveSection(page.sections[0]);
  }, [page]);

  if (!activeSection) return null;

  return (
    <main className={styles.page}>
      <AnimatePresence>{view === "text" && <LandingPageHeader setView={setView} />}</AnimatePresence>

      <AnimatePresence mode="popLayout">
        {view === "text" ? (
          <motion.div
            className={styles.sectionText}
            key={activeSection.sectionKey || activeSection.sectionTitle}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <Text text={activeSection.sectionText} typo="h3" />
          </motion.div>
        ) : (
          <Scene
            lightsEnabled={lightsEnabled}
            showHDRI={showHDRI}
            createEnvironmentScene={hdri}
            activeSection={activeSection}
            activeSectionIndex={activeSectionIndex}
            setView={setView}
          />
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

      <AnimatePresence>
        {view === "text" && (
          <LandingPageFooter
            page={page}
            activeSection={activeSection}
            setActiveSection={setActiveSection}
            setView={setView}
          />
        )}
      </AnimatePresence>
    </main>
  );
};

export default LandingPage;
