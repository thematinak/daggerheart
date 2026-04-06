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
        ${styles.tokens.card.base}
        ${styles.tokens.card.hover}
        ${hover ? "hover:shadow-lg hover:scale-[1.02]" : ""}
        ${selected ? styles.tokens.card.selected : styles.semantic.muted.border}
        cursor-pointer
      `}
    >
      {children}
    </div>
  );
};

export default GameCard;