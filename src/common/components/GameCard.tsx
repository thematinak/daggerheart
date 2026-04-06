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
        ${selected ? styles.tokens.card.selected : styles.semantic.muted.border}
        ${hover ? styles.tokens.card.hover : ""}
        ${onClick ? "cursor-pointer" : "cursor-default"}
      `}
    >
      {children}
    </div>
  );
};

export default GameCard;
