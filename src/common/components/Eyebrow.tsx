import React from "react";
import styles from "../types/cssColor"

const Eyebrow = ({ eyebrow, className }: { eyebrow: React.ReactNode; className?: string }) => (
  <div className={`${styles.tokens.page.eyebrow} ${className || ""}`}>
    {eyebrow}
  </div>
);

export default Eyebrow;