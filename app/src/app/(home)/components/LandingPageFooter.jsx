import styles from "../page.module.css";

const LandingPageFooter = ({ activeSection, setActiveSection }) => {
  const sections = ["The Approach", "The Origin", "The Design"];
  return (
    <div className={styles.pageFooter}>
      {sections.map((section) => (
        <div className={activeSection === section ? styles.active : ""} onClick={() => setActiveSection(section)}>
          {section}
        </div>
      ))}
    </div>
  );
};

export default LandingPageFooter;
