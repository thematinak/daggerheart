import React from "react";
import styles from "../types/cssColor";

type GameCardProps = {
  children: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  hover?: boolean;
};

const GameCard: React.FC<GameCardProps> = ({ children, selected, onClick, hover = true }) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative rounded-xl border p-4 flex flex-col gap-3
        shadow-sm transition-all
        ${hover ? "hover:shadow-lg hover:scale-[1.02]" : ""}
        ${selected ? `${styles.green.border} ${styles.green.bg}` : styles.gray.border}
        cursor-pointer
      `}
    >
      {children}
    </div>
  );
};

export default GameCard;