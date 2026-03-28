import React from "react";

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
        ${selected ? "border-green-700 bg-green-100" : "border-gray-300"}
        cursor-pointer
      `}
    >
      {children}
    </div>
  );
};

export default GameCard;