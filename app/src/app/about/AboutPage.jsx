"use client";

import Text from "@/components/Text/Text";
import LandingPageHeader from "../(landingPage)/components/LandingPageHeader";
import LandingPageFooter from "../(landingPage)/components/LandingPageFooter";
import styles from "../(landingPage)/LandingPage.module.css";
import { AnimatePresence } from "framer-motion";

const SECTION_MODELS = [
  { thumbnailPath: "/assets/models/13/13.gif" },
  { thumbnailPath: "/assets/models/14/14.gif" },
  { thumbnailPath: "/assets/models/16/16.gif" },
];

const AboutPage = ({ page, landingPage }) => {
  if (!page || page.length === 0) return null;

  const sections = landingPage?.sections ?? [];
  const defaultThumbnail = SECTION_MODELS[0].thumbnailPath;

  return (
    <main className={styles.page}>
      <LandingPageHeader thumbnailPath={defaultThumbnail} />

      <AnimatePresence key="aboutCredits">
        <div className={styles.aboutCredits}>
          <Text text={page.credits} typo="h3" />
        </div>
      </AnimatePresence>

      <LandingPageFooter
        page={{ sections }}
        activeSection={null}
        setActiveSection={() => {}}
        setView={() => {}}
        getSectionHref={(section) =>
          `/?section=${encodeURIComponent(section.sectionKey ?? section.sectionTitle ?? "")}&view=text`
        }
      />
    </main>
  );
};

export default AboutPage;
