import React from "react";

export type ClassItem = {
  id: string;
  name: string;
  description: string;
  baseHp: number;
  baseEvasion: number;
  domains: string[];
};

type ClassCardProps = {
  item: ClassItem;
  selected: boolean;
};

const ClassCard: React.FC<ClassCardProps> = ({ item, selected }) => (
  <div
    className={`
      rounded-xl border p-4 cursor-pointer
      transition-all duration-200
      hover:shadow-lg hover:scale-[1.02]
      ${selected ? "border-yellow-500 bg-yellow-50" : "border-gray-300"}
    `}
  >
    <h3 className="text-lg font-bold mb-2">{item.name}</h3>

    <p className="text-sm text-gray-600 mb-3">
      {item.description}
    </p>

    <div className="flex gap-4 text-sm mb-3">
      <span>❤️ HP: {item.baseHp}</span>
      <span>🌀 Evasion: {item.baseEvasion}</span>
    </div>

    <div className="flex flex-wrap gap-2">
      {item.domains.map((d) => (
        <span
          key={d}
          className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800"
        >
          {d}
        </span>
      ))}
    </div>
  </div>
);

export default ClassCard;