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
        cursor-pointer
      `}
      style={{
        borderColor: selected ? "#facc15" : "#e5e7eb", // selected: amber, otherwise light gray
        background: selected
          ? "linear-gradient(145deg, #fff7e6, #fffce8)" // jemný zlatý gradient
          : "linear-gradient(145deg, #f9fafb, #ffffff)", // bledý svetlý gradient
        boxShadow: selected
          ? "0 4px 15px rgba(250, 204, 21, 0.3)"
          : "0 2px 8px rgba(0,0,0,0.08)",
      }}
    >
      {children}
    </div>
  );
};

export default GameCard;