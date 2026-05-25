import AnimationLink from "@/components/Animation/AnimationLink";
import styles from "../LandingPage.module.css";

import { AnimatePresence, motion } from "framer-motion";

const LandingPageHeader = ({ setView, thumbnailPath, onThumbnailClick }) => {
  const handleClick = () => {
    if (onThumbnailClick) {
      onThumbnailClick();
      return;
    }
    setView?.("model");
  };

  return (
    <motion.div
      className={styles.landingPageHeader}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      <div className={styles.headerVideoSlot}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={thumbnailPath}
            className={styles.headerVideo}
            onClick={() => handleClick()}
            src={thumbnailPath}
            alt=""
            draggable={false}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: "easeOut" }}
          />
        </AnimatePresence>
      </div>

      <div className={styles.centerTitle}>Apern</div>

      <AnimationLink className={styles.aboutLink} path={"/about"}>
        (i)
      </AnimationLink>
    </motion.div>
  );
};

export default LandingPageHeader;
