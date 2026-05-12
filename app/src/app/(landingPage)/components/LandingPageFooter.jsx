import styles from "../page.module.css";

const LandingPageFooter = ({ page, activeSection, setActiveSection, setView }) => {
  const handleSectionClick = (section) => {
    setView("text");
    setActiveSection(section);
  };

  return (
    <div className={styles.landingPageFooter}>
      {page.sections.map((section) => (
        <div className={activeSection === section ? styles.active : ""} onClick={() => handleSectionClick(section)}>
          {section.sectionTitle}
        </div>
      ))}
    </div>
  );
};

export default LandingPageFooter;
