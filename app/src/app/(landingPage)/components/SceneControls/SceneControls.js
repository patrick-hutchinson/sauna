"use client";

import { useState } from "react";

import styles from "./SceneControls.module.css";

export default function SceneControls({
  modelVariant,
  setModelVariant,
  showHDRI,
  setShowHDRI,
  lightsEnabled,
  setLightsEnabled,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.menuRoot}>
      <button
        type="button"
        aria-label={isOpen ? "Close scene menu" : "Open scene menu"}
        aria-expanded={isOpen}
        className={`${styles.burgerButton} ${isOpen ? styles.burgerOpen : ""}`}
        onClick={() => setIsOpen((value) => !value)}
      >
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
        <span className={styles.burgerLine} />
      </button>

      <div className={`${styles.menuPanel} ${isOpen ? styles.menuPanelOpen : ""}`}>
        <p className={styles.menuLabel}>Scene</p>
        <button
          type="button"
          className={`${styles.menuButton} ${modelVariant === "compressed01" ? styles.active : ""}`}
          onClick={() => setModelVariant("compressed01")}
        >
          Ice 01
        </button>
        <button
          type="button"
          className={`${styles.menuButton} ${modelVariant === "compressed02" ? styles.active : ""}`}
          onClick={() => setModelVariant("compressed02")}
        >
          Ice 02
        </button>

        <p className={styles.menuLabel}>View</p>
        <button
          type="button"
          className={`${styles.menuButton} ${showHDRI ? styles.active : ""}`}
          onClick={() => setShowHDRI((value) => !value)}
        >
          {showHDRI ? "Hide HDRI" : "Show HDRI"}
        </button>
        <button
          type="button"
          className={`${styles.menuButton} ${lightsEnabled ? styles.active : ""}`}
          onClick={() => setLightsEnabled((value) => !value)}
        >
          {lightsEnabled ? "Lights On" : "Lights Off"}
        </button>
      </div>
    </div>
  );
}
