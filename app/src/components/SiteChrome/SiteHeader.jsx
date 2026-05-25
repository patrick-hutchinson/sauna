import AnimationLink from "@/components/Animation/AnimationLink";
import { motion } from "framer-motion";
import styles from "@/app/(landingPage)/LandingPage.module.css";

const SiteHeader = ({
  thumbnailPath,
  onThumbnailClick,
  centerTitle = "Apern",
  infoPath = "/about",
  showThumbnail = true,
}) => {
  return (
    <motion.div
      className={styles.landingPageHeader}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2, ease: "easeOut" }}
    >
      {showThumbnail && thumbnailPath ? (
        <video onClick={onThumbnailClick} autoPlay muted loop playsInline>
          <source src={thumbnailPath} />
        </video>
      ) : (
        <div />
      )}

      <div className={styles.centerTitle}>{centerTitle}</div>

      <AnimationLink path={infoPath}>(i)</AnimationLink>
    </motion.div>
  );
};

export default SiteHeader;
