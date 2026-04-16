import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeProvider";
import styles from "../types/cssColor";

type ThemeToggleButtonProps = {
  className?: string;
};

const ThemeToggleButton: React.FC<ThemeToggleButtonProps> = ({ className = "" }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`${styles.tokens.button.base} ${styles.tokens.button.secondary} gap-2 ${className}`}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
    >
      {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
};

export default ThemeToggleButton;
