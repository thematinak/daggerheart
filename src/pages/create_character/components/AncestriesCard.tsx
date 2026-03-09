import React from "react";

export type AncestrieModifications = {
  id: string;
  name: string;
  description: string;
};

export type AncestriesItem = {
  id: string;
  name: string;
  description: string;
  modifications: AncestrieModifications[];
};

type AncestrieCardProps = {
  item: AncestriesItem;
  selected?: boolean;
};

const AncestriesCard: React.FC<AncestrieCardProps> = ({ item, selected }) => (
  <div
    className={`
      rounded-xl border p-4 cursor-pointer
      transition-all duration-200
      hover:shadow-lg hover:scale-[1.02]
      ${selected ? "border-emerald-400 bg-emerald-50" : "border-gray-300"}
    `}
  >
    <h3 className="text-lg font-bold mb-2">{item.name}</h3>

    <p className="text-sm text-gray-600 mb-3">{item.description}</p>

    <div className="space-y-2">
      {item.modifications.map((mod) => (
        <div
          key={mod.id}
          className="p-2 rounded-lg bg-gray-100"
        >
          <div className="font-semibold text-sm">{mod.name}</div>
          <div className="text-xs text-gray-600">{mod.description}</div>
        </div>
      ))}
    </div>
  </div>
);

export default AncestriesCard;