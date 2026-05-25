"use client";

import Text from "@/components/Text/Text";
import SiteHeader from "@/components/SiteChrome/SiteHeader";
import SiteFooter from "@/components/SiteChrome/SiteFooter";
import styles from "../(landingPage)/LandingPage.module.css";
import { AnimatePresence } from "framer-motion";

const SECTION_MODELS = [
  { thumbnailPath: "/assets/models/13/13.mp4" },
  { thumbnailPath: "/assets/models/14/14.mp4" },
  { thumbnailPath: "/assets/models/16/16.mp4" },
];

const AboutPage = ({ page, landingPage }) => {
  if (!page || page.length === 0) return null;

  const sections = landingPage?.sections ?? [];
  const defaultThumbnail = SECTION_MODELS[0].thumbnailPath;

  return (
    <main className={styles.page}>
      <SiteHeader thumbnailPath={defaultThumbnail} onThumbnailClick={undefined} infoPath="/about" />

      <AnimatePresence key="aboutCredits">
        <div className={styles.aboutCredits}>
          <Text text={page.credits} typo="h3" />
        </div>
      </AnimatePresence>

      <SiteFooter
        sections={sections}
        activeSectionKey={null}
        getSectionHref={(section) =>
          `/?section=${encodeURIComponent(section.sectionKey ?? section.sectionTitle ?? "")}&view=text`
        }
      />
    </main>
  );
};

export default AboutPage;
