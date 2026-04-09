import React from "react";
import styles from "../types/cssColor"

const H2 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h2 className={`${styles.tokens.page.title} ${className || ""}`}>
    {children}
  </h2>
);

export default H2;