import styles from "../page.module.css";

import { motion } from "framer-motion";

const LandingPageHeader = ({ setView }) => {
  const handleClick = () => {
    setView("model");
  };
  return (
    <motion.div
      className={styles.landingPageHeader}
      key="landingPageFooter"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
    >
      <img src="/assets/models/turbosquid/12/thumbnail.png" onClick={() => handleClick()} />
    </motion.div>
  );
};

export default LandingPageHeader;
