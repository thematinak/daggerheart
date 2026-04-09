import React from "react";
import styles from "../types/cssColor"

const H3 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`${styles.tokens.page.smallerTitle} ${className || ""}`}>
    {children}
  </h3>
);

export default H3;