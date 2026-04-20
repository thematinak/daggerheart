import React from "react";

const H3 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <h3 className={`text-xl font-bold text-[var(--text-primary)] ${className || ""}`}>
    {children}
  </h3>
);

export default H3;