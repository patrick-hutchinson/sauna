import AnimationLink from "@/components/Animation/AnimationLink";
import { motion } from "framer-motion";
import styles from "@/app/(landingPage)/LandingPage.module.css";

const SiteFooter = ({
  sections = [],
  activeSectionKey = null,
  onSectionClick,
  getSectionHref,
}) => {
  return (
    <motion.div
      className={styles.landingPageFooter}
      key="siteFooter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      {sections.map((section) => {
        const key = section.sectionKey || section.sectionTitle;
        const isActive = activeSectionKey && activeSectionKey === section.sectionKey;
        const className = `${isActive ? styles.active : ""} ${styles.sectionTitle}`;

        if (getSectionHref) {
          return (
            <AnimationLink key={key} path={getSectionHref(section)} className={className}>
              {section.sectionTitle}
            </AnimationLink>
          );
        }

        return (
          <div key={key} className={className} onClick={() => onSectionClick?.(section)}>
            {section.sectionTitle}
          </div>
        );
      })}
    </motion.div>
  );
};

export default SiteFooter;
