import React from "react";

export type CommunityModifications = {
  id: string;
  name: string;
  description: string;
};

export type CommunityItem = {
  id: string;
  name: string;
  description: string;
  modifications: CommunityModifications;
  traits: string[];
};

type CommunityCardProps = {
  item: CommunityItem;
  selected?: boolean;
};

const CommunityCard: React.FC<CommunityCardProps> = ({ item, selected }) => (
  <div
    className={`
      rounded-xl border p-4 cursor-pointer
      transition-all duration-200
      hover:shadow-lg hover:scale-[1.02]
      ${selected ? "border-indigo-500 bg-indigo-50" : "border-gray-300"}
    `}
  >
    <h3 className="text-lg font-bold mb-2">{item.name}</h3>

    <p className="text-sm text-gray-600 mb-3">{item.description}</p>

    {/* Modifications */}
    <div className="p-2 rounded-lg bg-gray-100 mb-3">
      <div className="font-semibold text-sm">{item.modifications.name}</div>
      <div className="text-xs text-gray-600">{item.modifications.description}</div>
    </div>

    {/* Traits */}
    <div className="flex flex-wrap gap-2">
      {item.traits.map((trait) => (
        <span
          key={trait}
          className="px-2 py-1 text-xs rounded-full bg-gray-200 text-gray-800"
        >
          {trait}
        </span>
      ))}
    </div>
  </div>
);

export default CommunityCard;