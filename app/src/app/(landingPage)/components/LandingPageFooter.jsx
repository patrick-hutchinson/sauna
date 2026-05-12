import styles from "../page.module.css";

import { motion } from "framer-motion";

const LandingPageFooter = ({ page, activeSection, setActiveSection, setView }) => {
  const handleSectionClick = (section) => {
    setView("text");
    setActiveSection(section);
  };

  return (
    <motion.div
      className={styles.landingPageFooter}
      key="landingPageFooter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      {page.sections.map((section) => (
        <div
          key={section.sectionKey || section.sectionTitle}
          className={`${activeSection === section ? styles.active : ""} ${styles.sectionTitle}`}
          onClick={() => handleSectionClick(section)}
          typo="h3"
        >
          {section.sectionTitle}
        </div>
      ))}
    </motion.div>
  );
};

export default LandingPageFooter;
