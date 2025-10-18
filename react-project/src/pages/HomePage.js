import React from 'react';
import styles from '../styles/design.module.css';

const HomePage = () => {
  return (
    <div className={styles.homePageContainer}>
      {/* Top Green Bar */}
      <div className={styles.greenHeaderBar}>
        <div className={styles.headerSectionLeft}>
          <div className={styles.myWayLogo}>
            <span className={styles.myWayText}>MY WAY</span>
            <span className={styles.butterflyIconLeft}></span> {/* Simulate butterfly */}
          </div>
          <p className={styles.slogan}>عائلة واحدة</p>
        </div>
        <div className={styles.headerSectionRight}>
          <h1 className={styles.companyName}>شركة ماي واي</h1>
        </div>
      </div>

      {/* Main Content Area (White Background) */}
      <div className={styles.mainContent}>
        <div className={styles.leaderInfo}>
          <p className={styles.leaderName}>
            ليدر/ سناء صالح
            <span className={styles.purpleButterflyIcon}></span> {/* Simulate purple butterfly */}
          </p>
        </div>

        {/* Bottom Contact Info */}
        <div className={styles.contactInfo}>
          <div className={styles.infoItem}>
            <span className={styles.label}>موبايل:</span>
            <span className={styles.value} dir="ltr">٠١٢٢٥٠٠٩٢٨١</span> {/* Arabic digits, but LTR for phone */}
          </div>
          <div className={styles.infoItem}>
            <span className={styles.label}>كود:</span>
            <span className={styles.value} dir="ltr">١٨١٠٧٣٢٨</span> {/* Arabic digits, but LTR for code */}
          </div>
        </div>
      </div>

      {/* Watermark */}
      <div className={styles.watermark}>MY WAY</div>
    </div>
  );
};

export default HomePage;
