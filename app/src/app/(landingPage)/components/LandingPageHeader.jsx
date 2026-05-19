import styles from "../page.module.css";

import { motion } from "framer-motion";

const LandingPageHeader = ({ setView, thumbnailPath }) => {
  const handleClick = () => setView("model");

  return (
    <motion.div
      className={styles.landingPageHeader}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <video key={thumbnailPath} onClick={() => handleClick()} autoPlay muted loop playsInline>
        <source src={thumbnailPath} />
      </video>
    </motion.div>
  );
};

export default LandingPageHeader;
