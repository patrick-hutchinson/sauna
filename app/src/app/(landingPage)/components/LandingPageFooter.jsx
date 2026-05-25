import AnimationLink from "@/components/Animation/AnimationLink";
import styles from "../LandingPage.module.css";

import { motion } from "framer-motion";

const LandingPageFooter = ({
  page,
  activeSection,
  setActiveSection,
  setView,
  getSectionHref,
  activeSectionKey,
  shouldAnimate = false,
}) => {
  const handleSectionClick = (section) => {
    setView("text");
    setActiveSection(section);
  };

  const FooterTag = shouldAnimate ? motion.div : "div";
  const footerProps = shouldAnimate
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 2, ease: "easeOut" },
      }
    : {};

  return (
    <FooterTag className={styles.landingPageFooter} key="landingPageFooter" {...footerProps}>
      {page.sections.map((section) =>
        getSectionHref ? (
          <AnimationLink key={section.sectionKey || section.sectionTitle} path={getSectionHref(section)} typo="h3">
            <span
              className={`${activeSectionKey && section.sectionKey && activeSectionKey === section.sectionKey ? styles.active : ""} ${styles.sectionTitle}`}
            >
              {section.sectionTitle}
            </span>
          </AnimationLink>
        ) : (
          <div
            key={section.sectionKey || section.sectionTitle}
            className={`${activeSection === section ? styles.active : ""} ${styles.sectionTitle}`}
            onClick={() => handleSectionClick(section)}
            typo="h3"
          >
            {section.sectionTitle}
          </div>
        ),
      )}
    </FooterTag>
  );
};

export default LandingPageFooter;
